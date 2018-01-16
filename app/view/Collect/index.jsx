import React, { Component } from 'react';
import styles from './collect.scss';//是导入样式是使用的--
import { List, InputItem, Button, Tabs, ListView, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import RatingStar from 'components/RatingStar/star';
import { urlAPi } from 'service/api';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';
import { hashHistory } from 'react-router';
import ConfirmHtml from 'components/ConfirmHtml/';
import ConfirmButton from 'components/ConfirmButton/';
import { getStore } from 'utils/store';
import { meter } from 'utils/meter';

let loc = JSON.parse(getStore('location'));
const TeunLists = CSSModules(({ item, self }) => {
	return (
		<div key={item.id}>
			<SubViewLink moduleName="cateDetail" title="团购详情" modelData={{ id: item.id }} confirmButtonHtml={<ConfirmButton onChange={(value) => { item.is_collect = value; self.refresh(); }} id={item.id} item={item} isCollect={item.is_collect} />}>
				<div className="flex jc-between" styleName="shop-item" >
					<div className="flex flex-g-1">
						<div styleName="col-img"><img src={item.icon} /></div>
						<div className="flex-g-1" styleName="accoutone">
							<div>
								<h4>{item.name}</h4>
								<span>￥{item.current_price}&nbsp;<i >门市价：￥{item.origin_price}</i></span>
							</div>
						</div>
					</div>
					<div styleName='rightfont'>{meter(item.distance)}</div>
				</div>
			</SubViewLink>
		</div>
	);
}, require('./collect.scss'));
const ShopLists = CSSModules(({ item,self }) => {
	return (
		<div>
			<SubViewLink moduleName="business" modelData={{ id: item.id, }} confirmButtonHtml={<ConfirmHtml id={item.id} onChange={ () => {self.update();} }  isCollect={item.is_collect} />}>
				<div className="flex jc-between" key={item.id} styleName="shop-item" >
					<div className="flex flex-g-1">
						<div styleName="col-img"><img src={item.preview} /></div>
						<div className="flex-g-1" styleName="accoutone">
							<div>
								<h4 styleName="bus-name">{item.name}</h4>
								<p>类型&nbsp;:&nbsp;{item.cate_name}</p>
								<div className="flex mt5">
									<p >评级：</p>
									<RatingStar star={item.avg_point} isHide={true}></RatingStar>
								</div>
							</div>
						</div>
					</div>
					<div styleName='rightfont'>{meter(item.distance)}</div>
				</div>
			</SubViewLink>
		</div>
	);
}, require('./collect.scss'));

@CSSModules(styles)
class Collect extends Component {
	constructor(props) {
		super(props);
		const dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		});
		this.state = {
			m_longitude: loc ? loc.longitude:'',
			m_latitude: loc ? loc.latitude :'',
			dataSource: dataSource,
			page: 1,
			lists: [],
			idx: 0,
			isLoading: true,
			hasMore: true,
			pageInfo: {},
			tabs: [
				{ title: '团购及商品' },
				{ title: '店铺' },
			]
		};
	}
	componentDidMount() {
		this.getTuanList(1);
	}
	update = () => {
		this.setState({
			hasMore: true, lists: [], page: 1
		},()=> {
			this.getShopLists(1);
		});

	}
	getShopLists = async (page) => {
		const { m_longitude, m_latitude } = this.state;
		const params = {
			m_longitude: m_longitude,
			m_latitude: m_latitude,
			page: page
		};
		const res = await urlAPi.shopLists(params);
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			const { goods_list, page: pageInfo } = res.result;
			let newArr = [...this.state.lists,...goods_list];
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(newArr),
				lists: newArr,
				pageInfo: pageInfo,
				page: page,
				hasMore: (pageInfo.page_total <= page) ? false : true
			});
		}
		this.setState({
			isLoading: false,
		});
	}
	refresh = () => {
		this.setState({ hasMore: true, lists: [], page: 1 }, () => {
			this.getTuanList(1);
		});
	}
	getTuanList = async (page) => {
		const { m_longitude, m_latitude } = this.state;
		const params = {
			m_longitude: m_longitude,
			m_latitude: m_latitude,
			page: page
		};
		const res = await urlAPi.tuanLists(params);
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			const { goods_list, page: pageInfo } = res.result;
			const newArr = [...this.state.lists, ...goods_list];
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(newArr),
				lists: newArr,
				pageInfo: pageInfo,
				page: page,
				hasMore: (pageInfo.page_total <= page) ? false : true
			});
		}
		this.setState({
			isLoading: false,
		});
	}
	// 导航改变
	change = (tabs, index) => {
		if(this.state.isLoading) return false;
		if (this.state.idx === index) return false;
		this.setState({
			page: 1,
			idx: index,
			lists: [],
			dataSource: this.state.dataSource.cloneWithRows([]),
			isLoading: true,
			pageInfo: {},
			tabs: tabs
		});
		if (Object.is(index, 0)) {
			this.getTuanList(1);
		}

		if (Object.is(index, 1)) {
			this.getShopLists(1);
		}
	}
	// 加载更多
	loadMore = () => {
		const { pageInfo, hasMore, isLoading, page, status, idx } = this.state;
		if (page >= pageInfo.page_total) {
			this.setState({
				hasMore: false
			});
			return false;
		}
		if (isLoading) return false;
		let currentPage = page + 1;
		this.setState({
			isLoading: true
		});
		if (Object.is(idx, 0)) {
			this.getTuanList(currentPage);
		}
		if (Object.is(idx, 1)) {
			this.getShopLists(currentPage);
		}
	}
	render() {
		const { lists, idx, dataSource, isLoading, tabs } = this.state;
		const row = (rowData, rowID) => {
			return (
				<div key={rowID}>
					{Object.is(idx, 0) && <TeunLists item={rowData} self={this}></TeunLists>}
					{Object.is(idx, 1) && <ShopLists item={rowData} self={this }></ShopLists>}
				</div>
			);
		};
		return (
			<div className="collect-box flex-col">
				<div className="flex coll-nav">
					{tabs && tabs.map((item, index) => {
						return (<div key={index} className={`flex-g-1 ${idx === index ? 'active' : ''}`} onClick={() => { this.change(tabs, index); }}>{item.title}</div>);
					})}
				</div>
				<div className="flex-g-1 scroll-absolute" styleName="shop-bg">
					<div>
						{Array.from({ length: 2 }).map((item, index) => {
							return (
								Object.is(idx, index) && (
									<ListView
										key={index}
										ref={el => this.lv = el}
										dataSource={dataSource}
										renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
											{isLoading ? '加载中...' : '没有更多数据加载了!'}
										</div>)}
										renderRow={row}
										style={{
											overflow: 'auto',
										}}
										pageSize={4}
										onScroll={() => { }}
										scrollRenderAheadDistance={200}
										onEndReached={this.loadMore}
										onEndReachedThreshold={50}
									/>
								)
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default Collect;
