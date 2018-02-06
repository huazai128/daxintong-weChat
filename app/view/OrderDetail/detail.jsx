import React, { Component } from 'react';
// import Nav from 'components/Navtwo';
import CSSModules from 'react-css-modules';
import RatingStar from 'components/RatingStar/star';
import styles from './styles.scss';
import { urlAPi } from 'service/api';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';
import { Toast } from 'antd-mobile';
import ConfirmHtml from 'components/ConfirmHtml/';
import ConfirmButton from 'components/ConfirmButton/';
import { meter } from 'utils/meter';
import { getStore } from 'utils/store';
let wx = window.wx;

let loc = JSON.parse(getStore('location'));
@CSSModules(styles)
class Payment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: props.modelData.id,
			order_item: {},
			coupon_list: [],
			supplier_lists: [],
			order_value: [],
			is_ok_refund: 0,
			coupon_end_time: '',
			kf_phone: '',
			idx: 2,
			isMore: false
		};
	}
	componentDidMount() {
		this.getOrderDetail();
	}
	// 获取数据
	getOrderDetail = async () => {
		const params = {
			id: this.state.id,
			m_longitude: loc ? loc.longitude : '',
			m_latitude: loc ? loc.latitude : '',
		};
		const res = await urlAPi.orderDetail(params);
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			const { order_item, coupon_list, supplier_location_list, order_value, is_ok_refund, coupon_end_time, kf_phone } = res.result;
			this.setState({
				order_item: order_item,
				coupon_list: coupon_list,
				supplier_lists: supplier_location_list,
				order_value: order_value,
				is_ok_refund: is_ok_refund,
				coupon_end_time: coupon_end_time,
				kf_phone: kf_phone
			});
		}
	}
	componentWillUnmount() {
		this.props.modelData.refresh();
	}
	more = (len) => {
		this.setState({
			idx: len,
			isMore: true
		});
	}
	onPhone = () => {
		Toast.info('无电话号码', 2);
	}
	// 微信地图
	getLocation = (obj) => {
		wx.ready(() => {
			wx.openLocation({
				latitude: obj.ypoint, // 纬度，浮点数，范围为90 ~ -90
				longitude: obj.xpoint, // 经度，浮点数，范围为180 ~ -180。
				name: obj.name, // 位置名
				address: obj.address, // 地址详情说明
				scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
				infoUrl: ''
			});
		});
	}
	render() {
		const { page, id } = this.props.modelData;
		const { order_item, coupon_list, supplier_lists, order_value, is_ok_refund, coupon_end_time, kf_phone, is_collect, idx, isMore } = this.state;
		return (
			<div>
				{/* <Nav path="/">订单详情</Nav> */}
				<div styleName="payment-box">
					<SubViewLink moduleName="cateDetail" title="团购详情" modelData={{ id: order_item.deal_id, }} confirmButtonHtml={<ConfirmButton onChange={(value) => { order_item.is_collect = value; }} id={order_item.deal_id} item={order_item} isCollect={order_item.is_collect} />}>
						<div styleName="shop-detail" >
							<div styleName="shop-img" className="mr20"><img src={order_item.deal_icon} /></div>
							<div styleName="shop-over">
								<h4>{order_item.name}</h4>
								<p>{order_item.unit_price}</p>
								<div className="tag-lists">
									{order_item.deal_tags && order_item.deal_tags.map((item, index) => {
										return (
											<div key={index} className="mr15" styleName="shop-type">{item}</div>
										);
									})}
								</div>
							</div>
						</div>
					</SubViewLink>
					{/* 支付 */}
					{Object.is(page, 1) && (
						<div>
							<SubViewLink moduleName="commnents" title="评论列表" modelData={{ data_id: order_item.deal_id, type: 'deal' }}>
								<div styleName="score" className="flex flex-vcenter">
									<p>评级 </p>
									<RatingStar star={order_item.avg_point} isHide={true}></RatingStar>
								</div>
							</SubViewLink>
							<div styleName="pay-money">
								<button type="button">
									<SubViewLink moduleName="pay" title="支付订单" modelData={{ order_id: order_item.id }}>去支付</SubViewLink>
								</button>
							</div>
						</div>
					)}
					{/* 使用 */}
					{Object.is(page, 2) && (
						<div>
							<div styleName="score" className="flex flex-vcenter score-bg">
								<div className="flex-col-8">
									<SubViewLink moduleName="commnents" title="评论列表" modelData={{ data_id: order_item.deal_id, type: 'deal' }}>
										<div className=" flex flex-vcenter">
											<p>评级 </p>
											<RatingStar star={order_item.avg_point} isHide={true}></RatingStar>
										</div>
									</SubViewLink>
								</div>
								{Object.is(is_ok_refund, 1) && (<div className="flex-col-4" styleName="refund"><SubViewLink moduleName="refund" title="退款申请" modelData={{ id: order_item.id }}>我要退款</SubViewLink></div>)}
							</div>
							<div styleName="tuan-detail">
								<h4 >团购券</h4>
								<div styleName="tuan-items">
									<p>有效时间：{coupon_end_time}</p>
									{coupon_list && coupon_list.map((item, index) => {
										return (
											<div key={index} className="flex jc-between">
												<p>券码：{item.password}</p>
												<span><SubViewLink moduleName="teamBuy" title="团购券详情" modelData={{ id: item.id }}>{item.status}></SubViewLink></span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}
					{/* 评论 */}
					{Object.is(page, 3) && (
						<div>
							<SubViewLink moduleName='evaluate' title="我要评价" modelData={{ data_id: order_item.deal_id, type: 'deal' }}>
								<div styleName="score " className="flex flex-vcenter">
									<div className="flex-col-8 flex flex-vcenter">
										<p>评级 </p>
										<RatingStar star={order_item.avg_point} isHide={true}></RatingStar>
									</div>
									<div className="flex-col-4" styleName="go-comments">去评价</div>
								</div>
							</SubViewLink>
							<div styleName="tuan-detail">
								<h4 >团购券</h4>
								<div styleName="tuan-items">
									<p>有效时间：{coupon_end_time}</p>
									{coupon_list && coupon_list.map((item, index) => {
										return (
											<div key={index} className="flex jc-between">
												<p>券码：{item.password}</p>
												<span><SubViewLink moduleName="teamBuy" title="团购券详情" modelData={{ id: item.id }}>{item.status}></SubViewLink></span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}

					{/* 评论 */}
					{Object.is(page, 4) && (
						<div>
							<div styleName="no-comment" className="flex flex-vcenter">
								<div className="flex-col-8 flex flex-vcenter">
									<p>评级 </p>
									<RatingStar star={order_item.avg_point} isHide={true}></RatingStar>
								</div>
							</div>
							<div styleName="tuan-detail">
								<h4 >团购券</h4>
								<div styleName="tuan-items">
									<p>有效时间：{coupon_end_time}</p>
									{coupon_list && coupon_list.map((item, index) => {
										return (
											<div key={index} className="flex jc-between">
												<p>券码：{item.password}</p>
												<span><SubViewLink moduleName="teamBuy" title="团购券详情" modelData={{ id: item.id }}>{item.status}></SubViewLink></span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}
					<div styleName="shop-info" className="mb20">
						<p>商家信息</p>
						{supplier_lists && supplier_lists.slice(0, idx).map((item, index) => {
							return (
								<div className="flex pr20" key={index} >
									<div className="flex-g-1" styleName="shop-pos" onClick={ () => { this.getLocation(item); } }>
										<h4>{item.name}</h4>
										<p>{item.address}</p>
										<span>{meter(item.distance)}</span>
									</div>
									<div className="flex-center">
										{item.tel && (<a href={`tel:${item.tel}`} styleName="shop-phone"></a>)}
										{!item.tel && (<div onClick={this.onPhone} styleName="shop-phone"></div>)}
									</div>
								</div>
							);
						})}
						{supplier_lists && supplier_lists.length > 2 && !isMore && (<div styleName="pay-more" className="mb20" onClick={() => { this.more(supplier_lists.length); }}>+查看全部门店</div>)}
					</div>

					<div styleName="tuan-detail">
						<p>套餐详情</p>
						<div styleName="shop-lists">
							<div dangerouslySetInnerHTML={{
								__html: order_item.package_info && order_item.package_info.replace(/\d+(\.\d+)?px/g, function (s, t) {
									s = s.replace('px', '');
									var value = Number(s) * 0.016;//   此处 1rem =120px
									return value + 'rem ';
								})
							}}>
							</div>
						</div>
						<div styleName="img-detail"><SubViewLink moduleName="graphic" title="图文详情" modelData={{ id: order_item.id, description: order_item.description }}>查看图文详情 ></SubViewLink> </div>
					</div>
					<div styleName="order-details">
						<h4>订单详情</h4>
						{order_value && order_value.map((item, index) => {
							return (<p key={index}>{item.name}：{item.value}</p>);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default Payment;
