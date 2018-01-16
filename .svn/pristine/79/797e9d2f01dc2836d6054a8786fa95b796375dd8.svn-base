import { observable, computed, useStrict, action, runInAction, autorun } from 'mobx';
import apiUrl from 'utils';
import { ListView, Toast } from 'antd-mobile';
import { getStore,setStore } from 'utils/store';

// let loc = JSON.parse(getStore('location'));
useStrict(true);
class Store {
	url = {
		ctl: 'stores_tuan',
		act: 'index',
	}
	page = 1;
	cate_id = null;
	AlreadyCompleted = false;
	quansId = JSON.parse(getStore('quansValue'));
	@computed get query() {
		return {
			...this.url,
			order_type: this.navsValue.toString(),
			qid: this.quansValue.length ? this.quansValue.toString() : this.quansId,
			tid: this.catesValue.toString(),
			page: this.page,
			cate_id: this.cate_id,
			m_longitude: this.loc ? this.loc.longitude:'',
			m_latitude: this.loc ? this.loc.latitude :''
		};
	}
	//
	@observable data = {};
	@observable navsValue = [];
	@observable quansValue = [];
	@observable catesValue = [];
	@observable dataSource = new ListView.DataSource({
		rowHasChanged: (row1, row2) => row1 !== row2,
	})
	@observable isLoading = true;

	@action setLoc = () => {
		this.loc = JSON.parse(getStore('location'));
	}
	// 获取数据
	@action getData = async () => {
		this.isLoading = true;
		if (this.AlreadyCompleted) return false;
		const { result } = await apiUrl('', this.query);
		runInAction(() => {
			this.data = result;
			// default
			this.navsValue = [result.navs[0].code];
			this.quansValue = [result.quan_id];
			this.catesValue = [result.bcate_list.bcate_type[0].id];
			this.cate_id = result.bcate_list.id;
			this.items = result.item;
			this.dataSource = this.dataSource.cloneWithRows(this.items);
			this.isLoading =  false;
			// 完成请求 AlreadyCompleted设为true  下次从其他路由跳进来的时候不在重新请求
			this.AlreadyCompleted = false;
		});
	}
	@action update = async () => {
		this.isLoading = true;
		this.page = 1;
		this.animating = true;
		this.dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		const { result } = await apiUrl('', this.query);
		runInAction(() => {
			this.animating = false;
			this.data.page = result.page;
			this.items = result.item;
			this.dataSource = this.dataSource.cloneWithRows(this.items);
			this.isLoading = false;
		});
	}
	// 下拉加载
	@action loadMore = async () => {
		this.isLoading = false;
		if (this.page >= this.data.page.page_total) return false;
		this.page = this.page + 1;
		if(this.isLoading) return false;
		this.isLoading = true;
		const { result } = await apiUrl('', this.query);
		runInAction(() => {
			const newItems = [...this.items,...result.item];
			this.items = newItems;
			this.dataSource = this.dataSource.cloneWithRows(newItems);
			this.isLoading = false;
		});
	}
	@action onChange = (value, type, cb) => {
		if (Object.is(type, 'quansValue')) {
			setStore('quansValue', value);
		}
		this[type] = value;
		cb && cb();
	}

	@action reset = () => {
		this.page = 1;
		this.isLoading = false;
		this.keyword = '';
	}

	// 排序方式
	@computed get navs() {
		const { navs = [] } = this.data;
		const reslut = navs.map(item => ({
			label: item.name,
			value: item.code,
		}));
		return reslut;
	}
	// 商圈
	@computed get quans() {
		const { quan_list = [] } = this.data;
		const reslut = quan_list.map(item => ({
			keyLabel: item.keyname,
			label: item.name,
			value: item.id,
		}));
		return reslut;
	}

	// 美食分类
	@computed get cates() {
		const { bcate_list } = this.data;
		if (!bcate_list) return;

		const { bcate_type } = bcate_list;

		const reslut = bcate_type.map(item => ({
			label: item.name,
			value: item.id,
		}));
		return reslut;
	}
}
const store = new Store();

export default store;
