import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Carousel, Icon, ListView, Toast } from 'antd-mobile';
import Picker from 'components/Picker';
import { CateBadge } from 'components/Icon';
import RatingStar from 'components/RatingStar/star';
import styles from './style.scss';
import CSSModules from 'react-css-modules';
import { hashHistory } from 'react-router';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';
import { urlAPi } from 'service/api';
import ConfirmHtml from 'components/ConfirmHtml/';
import ConfirmButton from 'components/ConfirmButton/';
import { getStore } from 'utils/store';
import { meter } from 'utils/meter';

@CSSModules(styles)
class Row extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rowData:{},
			sectionID:'',
			rowID:'',
			store:{}
		};
	}
	componentDidMount(){

		let { rowData, sectionID, rowID, store } = this.props;
		this.setState({
			rowData:rowData,
			sectionID:sectionID,
			rowID:rowID,
			store:store
		});
	}
	changeHtml = (value) => {
		let { rowData } = this.state;
		rowData.is_collect = value;
		this.setState({
			rowData:rowData
		});
	}
	render() {
		let { rowData, sectionID, rowID, store } = this.state;
		const { preview, name, cate_name, tuan_list = [], voucher_list = [], id, avg_point, distance, is_collect } = rowData;
		return (
			<div key={rowID}>
				<div styleName="cate-item" className="flex">
					<SubViewLink moduleName="business" modelData={{ id: id, store: store }} confirmButtonHtml={<ConfirmHtml id={id} isollect={is_collect} onChange={ (value) => { this.changeHtml(value); } } />}>
						<div styleName="item-img" onClick={ () => {
						// hashHistory.push(`/business/${ id }`);
						} }><img src={preview} /> </div>
					</SubViewLink>
					<div className="ml20 flex d-column flex-g-1" style={{ overflow: 'hidden' }}>
						<section onClick={() => {
							// hashHistory.push(`/business/${ id }`);
						}}>
							<SubViewLink moduleName="business" title="商家详情" modelData={{ id: id, store: store }} confirmButtonHtml={<ConfirmHtml id={id} isCollect={is_collect} onChange={ (value) => { this.changeHtml(value); } } />}>
								<div styleName="cate-ft"><strong>{name}</strong></div>
								<div className="jc-between flex-vcenter"styleName="cate-star">
									<div>
										<RatingStar isHide={true} star={avg_point}></RatingStar>
									</div>
									<div className="mr25 flex">
										<p>{meter(distance)}</p>
									</div>
								</div>
								<p >{cate_name}</p>
							</SubViewLink>
						</section>
						<div className="borderTop">
							{tuan_list && tuan_list.slice(0, 3).map((item, index) => (
								<div key={item.id} >
									<SubViewLink moduleName="cateDetail" title="团购详情" modelData={{ id: item.id, store: store }} confirmButtonHtml={<ConfirmButton onChange={(value) => { item.is_collect = value; }} id={item.id} item={item} isCollect={item.is_collect} />}>
										<div className="pt10 pb10" onClick={ () => {
										// hashHistory.push(`/cateDetail/${ item.id }`);
										} }>
											<CateBadge backgroundColor="#18a2fa" className="mr10">团</CateBadge>
											<p styleName="item-detail" className="text-overflow">{item.name}</p>
										</div>
									</SubViewLink>
								</div>
							))}
							{voucher_list && voucher_list.slice(0, 1).map(item => (
								<div key={item.id} >
									<SubViewLink moduleName="cateDetail" title="团购详情" modelData={{ id: item.id, store: store }} confirmButtonHtml={<ConfirmButton onChange={(value) => { item.is_collect = value; }} id={item.id} item={item} isCollect={item.is_collect} />}>
										<div className="pt10 pb10" onClick={ () => {
										// hashHistory.push(`/cateDetail/${ item.id }`);
										} }>
											<CateBadge backgroundColor="#18a2fa" className="mr10">券</CateBadge>
											<p styleName="item-detail" className="text-overflow">{item.name}</p>
										</div>
									</SubViewLink>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
@observer
class HeadContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flag: false,
			picker: {}
		};
	}
	getTop = () => {
		return this.refs.picker.getBoundingClientRect().top;
	}
	render() {
		const { data, navsValue } = this.props;
		const { flag } = this.state;
		this.store = this.props.store;
		let url = location.href.split('#')[0];
		return (
			<div>
				{
					data && data.advs && data.advs.length > 0 && (
						<Carousel
							autoplay
							infinite
							autoplayInterval={3000}
							selectedIndex={0}>
							{ data.advs.map((item, index) => (
								<div key={index} className="swiper-bg" onClick={() => {
									switch (item.type) {
									case 0: break;
									case 1: window.location.href = item.data.url; break;
									case 2: window.location.href = `${url}#/cateDetail/${item.data.data_id}`; break;
									case 3: window.location.href = `${url}#/business/${item.data.data_id}`; break;
									}
								}}>
									<img
										width="100%"
										src={item.img}
										onLoad={() => {
											window.dispatchEvent(new Event('resize'));
											this.setState({
												initialHeight: null,
											});
										}}
									/>
								</div>
							))}
						</Carousel>
					)
				}
				{(
					<div style={{ backgroundColor: '#fff' }} ref='picker' className={`flex borderTop borderBottom ${this.state.flag ? 'fiexd-hide' : ''}`}>
						<Picker data={this.store.quans} value={this.store.quansValue} onOk={value => this.store.onChange(value, 'quansValue', this.store.update)} span={4}></Picker>
						<Picker data={this.store.cates} value={this.store.catesValue} onOk={value => this.store.onChange(value, 'catesValue', this.store.update)} span={4} className="pl50 pr50 borderRight borderLeft">美食</Picker>
						<Picker data={this.store.navs} value={navsValue} onOk={value => this.store.onChange(value, 'navsValue', this.store.update)} span={4}>排序方式</Picker>
					</div>
				)}
			</div>
		);
	}
}
@inject(store => ({
	cate: store.cate,
	login: store.login,
	}))
@observer
export default class extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.cate;
		this.state = {
			flag: false
		};
	}
	componentDidMount() {
		const { query } = this.props.location;
		this.store.setLoc();
		this.store.getData();
	}
	componentWillUnmount(){
		this.store.isLoadState();
	}
	render() {
		const { data, navsValue, isLoading } = this.store;
		let renderRow = (rowData, sectionID, rowID) => {
			if (rowData.hide) {
				return;
			}
			return <Row rowData={rowData} store={this.props.login} sectionID={sectionID} rowID={rowID} />;
		};
		return (
			<div className="flex-col">
				<div >
					<div className="cate-head flex-center">
						<div className="flex flex-vcenter" onClick={() => {
							hashHistory.push({
								pathname: '/search',
								query: {
									name: '/'
								}
							});
						}}><Icon type="search" /> <div className="sreach-name">搜索团购或商家</div></div>
					</div>
				</div>
				<div className={`flex-g-1 box_showe ${this.state.flag}`} >
					<div>
						{this.state.flag && (
							<div style={{ backgroundColor: '#fff' }} className={`flex borderTop borderBottom ${this.state.flag ? 'fiexd-top' : ''}`}>
								<Picker data={this.store.quans} value={this.store.quansValue} onOk={value => {this.store.onChange(value, 'quansValue', this.store.update);
									if(this.state.flag && data && !data.length){
										this.setState({flag:false});
									}else{
										this.setState({flag:true});
									}
								}} span={4}></Picker>
								<Picker data={this.store.cates} value={this.store.catesValue} onOk={value => this.store.onChange(value, 'catesValue', this.store.update)} span={4} className="pl50 pr50 borderRight borderLeft">美食</Picker>
								<Picker data={this.store.navs} value={navsValue} onOk={value => this.store.onChange(value, 'navsValue', this.store.update)} span={4}>排序方式</Picker>
							</div>
						)}
						<ListView
							ref={el => this.lv = el}
							renderFooter={() => (<div style={{ textAlign: 'center' }}>
								{isLoading ? '加载中...' : '没有更多内容加载了'}
							</div>)}
							style={{
								overflow: 'auto',
							}}
							onEndReached={this.store.loadMore}
							dataSource={this.store.dataSource}
							renderHeader={() => <HeadContent ref={(r) => { this.refshc = r; }} data={data} flag={this.state.flag} store={this.props.cate} navsValue={navsValue}></HeadContent>}
							renderRow={renderRow}
							pageSize={4}
							onScroll={() => { if (this.refshc.getTop() < 140) { this.setState({ flag: true }); } else { this.setState({ flag: false }); } }}
							scrollRenderAheadDistance={100}
							onEndReachedThreshold={50}
						/>
					</div>
				</div>
			</div >
		);
	}
}
