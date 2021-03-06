import {
	observable,
	computed,
	useStrict,
	action,
	runInAction,
	autorun,
	toJS
} from 'mobx';
import apiUrl from 'utils';
import {
	ListView,
	Toast
} from 'antd-mobile';
import {
	getStore,
	setStore
} from 'utils/store';

useStrict(true);
class Store {
	constructor() {
		this.loc = null;
	}
	@computed get query() {
		return {
			...this.url,
			order_type: this.navsValue.toString(),
			qid: this.quansValue.length ? this.quansValue.toString() : this.quansId || 24,
			tid: this.catesValue.toString(),
			page: this.page,
			cate_id: this.cate_id,
			m_longitude: this.loc ? this.loc.longitude : '',
			m_latitude: this.loc ? this.loc.latitude : ''
		};
	}
	url = {
		ctl: 'index',
		act: 'index',
	}
	page = 1
	cate_id = null
	AlreadyCompleted = false;
	_quers = [];
	quansId = '';
	@observable data = {}
	@observable animating = false
	@observable catesValue = []
	@observable quansValue = [];
	@observable navsValue = []
	@observable isLoading = false;
	@observable dataSource = new ListView.DataSource({
		rowHasChanged: (row1, row2) => row1 !== row2,
	})
	@action reset = () => {
		this.page = 1;
		this.isLoading = false;
		this.keyword = '';
	}
	@action setLoc = () => {
		this.loc = JSON.parse(getStore('location'));
	}
	@action getQuans = () => {
		this.quansId = JSON.parse(getStore('quansValue'));
		this.quansValue = [];
	}
	@action getData = async() => {
		this.isLoading = true;
		if (this.AlreadyCompleted) return false;
		this.AlreadyCompleted = true;
		const {
			result,
			sess_id
		} = await apiUrl('', this.query);
		runInAction(() => {
			this.isLoadState();
			this.data = result;
			this.navsValue = [result.navs[0].code];
			this.quansValue = [result.quan_id];
			this.catesValue = [result.bcate_list.bcate_type[0].id];
			this.cate_id = result.bcate_list.id;
			this.items = result.item;
			setStore('sess_id', sess_id);
			this.dataSource = this.dataSource.cloneWithRows(this.items);
			this.AlreadyCompleted = false;
		});
	}
	@action isLoadState = () => {
		this.isLoading = false;
	}
	@action update = async() => {
		this.isLoading = true;
		this.page = 1;
		this.animating = true;
		this.dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		const {
			result
		} = await apiUrl('', this.query);
		runInAction(() => {
			this.isLoading = false;
			this.data = result;
			this.animating = false;
			this.data.page = result.page;
			this.items = result.item;
			this.dataSource = this.dataSource.cloneWithRows(this.items);
		});
	}
	// 下拉加载
	@action loadMore = async() => {
		this.isLoading = false;
		if (this.page >= this.data.page.page_total) return false;
		this.page = this.page + 1;
		if (this.isLoading){
			this.isLoading = false;
			return false;
		}
		this.isLoading = true;
		const {
			result
		} = await apiUrl('', this.query);
		if(result.item.length){
			runInAction(() => {
				const newItems = [...this.items, ...result.item];
				this.items = newItems;
				this.dataSource = this.dataSource.cloneWithRows(newItems);
				this.isLoading = false;
			});
		}
	}
	@action onChange = (value, type, cb) => {
		if (Object.is(type, 'quansValue')) {
			setStore('quansValue', value);
		}
		this[type] = value;
		cb && cb();
	}
	// 排序方式
	@computed get navs() {
		const {
			navs = []
		} = this.data;
		const reslut = navs.map(item => ({
			label: item.name,
			value: item.code,
		}));
		return reslut;
	}
	// 商圈
	@computed get quans() {
		const {
			quan_list = []
		} = this.data;
		const result = quan_list.map(item => {
			return {
				keyLabel: item && item.keyname,
				label: item && item.name,
				value: item && item.id,
			};
		});
		return result;
	}
	// 美食分类
	@computed get cates() {
		const {
			bcate_list
		} = this.data;
		if (!bcate_list) return;
		const {
			bcate_type
		} = bcate_list;
		const reslut = bcate_type.map(item => ({
			label: item.name,
			value: item.id,
		}));
		return reslut;
	}
}

const store = new Store();

export default store;
