import React, { Component } from 'react';
import { Carousel, WhiteSpace, WingBlank, NavBar, Icon, Badge, Toast, ListView } from 'antd-mobile';
import asyncComponent from 'app/hoc/asyncComponent';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';
import Picker from 'components/Picker';
import RatingStar from 'components/RatingStar/star';
import { CateBadge } from 'components/Icon';
import styles from './recommend.scss';
import { observer, inject } from 'mobx-react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { urlAPi } from 'service/api';
import ConfirmHtml from 'components/ConfirmHtml/';
import ConfirmButton from 'components/ConfirmButton/';
import { meter } from 'utils/meter';

const Item = ({ item, store }) => {
	return (
		<SubViewLink key={item.id} moduleName="cateDetail" title="团购详情" modelData={{ id: item.id, store: store }} confirmButtonHtml={<ConfirmButton onChange={(value) => { item.is_collect = value;  }} id={item.id} item={item} isCollect={item.is_collect} />}>
			<section className={`${styles.items} flex`}>
				<div className={`${styles.img} mr20`}>
					<img src={item.icon} />
				</div>
				<div className="flex-g-1">
					<div className={styles.itemTitle}>{item.name}</div>
					<div className="flex">
						<div className={`${styles.originPrice} flex-g-1`}><span className={styles.price}>{item.current_price}元</span>门市价: {item.origin_price}元</div>
						<div className={styles.amount}>已售{item.buy_count}</div>
					</div>
				</div>
			</section>
		</SubViewLink>
	);
};
class ShopItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			len:2,
			isShow:true
		};
	}
	more = (len) => {
		this.setState({
			len: this.state.isShow ? len: 2,
			isShow: !this.state.isShow
		});
	}
	render() {
		const { rowData, sectionID, rowID, store } = this.props;
		const { avg_point, distance, id, name, xpoint, ypoint, tuan_list,is_collect } = rowData;
		const { len,isShow } = this.state;
		return (
			<div className={`${styles.shop} mb20`} key={sectionID}>
				<div className={styles.head} >
					<SubViewLink moduleName="business" title="商家详情" modelData={{ id: id, store: store }} confirmButtonHtml={<ConfirmHtml id={id} isCollect={is_collect} onChange={ (value) => {rowData.is_collect = value; } } />}>
						<div className="flex jc-start mb10">
							<p className={styles.margr}>{name}</p>
							{/* <CateBadge backgroundColor="#18a2fa" className="mt5 mr10">团</CateBadge>
							<CateBadge backgroundColor="#ff9f00" className="mt5 mr10">劵</CateBadge> */}
						</div>
						<div className="flex jc-between">
							<RatingStar star={avg_point} ></RatingStar>
							<p className={styles.ju}>	<p>{meter(distance)}</p></p>
						</div>
					</SubViewLink>
				</div>
				<div className={styles.content}>
					{tuan_list && tuan_list.slice(0, len).map((item, index) => <Item key={item.id} store={store} item={item}></Item>)}
				</div>
				{(tuan_list.length > 2 ) ? <div className={`${styles.more} flex-center`} onClick={ () => {this.more(tuan_list.length);}  }>{ isShow ? `查看其它${tuan_list.length - 2}条团购`:'收起' }</div>: ''}
			</div>
		);
	}
}

@inject(stores => ({
	recommend: stores.recommend,
	login: stores.login
}))
@observer
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	store = this.props.recommend;
	componentDidMount() {
		this.store.setLoc();
		this.store.getData();
	}
	componentWillUnmount(){
		this.store.reset();
	}
	renderRow = (rowData, sectionID, rowID) => {
		return <ShopItem rowData={rowData} key={rowID} store={this.props.login} sectionID={sectionID} rowID={rowID} />;
	}
	render() {
		const { update, isLoading } = this.store;
		return (
			<div className="flex-col">
				<NavBar
					mode="light"
					rightContent={[
						<div key="0" className="search-box" onClick={() => {
							hashHistory.push({
								pathname: '/search',
								query:{
									name:'/goods'
								}
							});
						}}>
							<Icon type="search" />
						</div>
					]}
				>精选</NavBar>
				<div style={{ backgroundColor: '#fff' }} className="flex borderBottom">
					<Picker data={this.store.quans} value={this.store.quansValue} onOk={(value) => this.store.onChange(value, 'quansValue', update)} span={4}></Picker>
					<Picker data={this.store.cates} value={this.store.catesValue} onOk={(value) => this.store.onChange(value, 'catesValue', update)} span={4} className="pl50 pr50 borderRight borderLeft"></Picker>
					<Picker data={this.store.navs} value={this.store.navsValue} onOk={(value) => this.store.onChange(value, 'navsValue', update)} span={4}></Picker>
				</div>

				<div className="flex-g-1 scroll-absolute">
					<div>
						<ListView
							ref={el => this.lv = el}
							dataSource={this.store.dataSource}
							renderRow={this.renderRow}
							style={{
								overflow: 'auto',
							}}
							len={this.store.dataSource.length}
							pageSize={4}
							onScroll={() => {  }}
							scrollRenderAheadDistance={500}
							onEndReached={this.store.loadMore}
							onEndReachedThreshold={50}
							renderFooter={() => (<div style={{ textAlign: 'center' }}>
								{isLoading ? '加载中...' : '没有更多内容加载了'}
							</div>)}
							style={{
								overflow: 'auto',
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}
