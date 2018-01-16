import React, { Component } from 'react';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import styles from './refund.scss';//是导入样式是使用的--
import { List, TextareaItem, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { urlAPi } from 'service/api';
import { SubViewLink, subViewHandle } from 'app/components/subViewLink/subViewLink';

const Radio = CSSModules(({ lable, status, onChange }) => {
	return (
		<div className="radio-box">
			<div className="flex jc-between flex-center" onClick={() => {
				onChange(!status);
			}}>
				{lable ? <div className="mr15">{lable}</div> : ''}
				<div className={`icon ${status ? 'selected' : ''}`}></div>
			</div>
		</div>
	);
}, require('./refund.scss'));
@CSSModules(styles)
class SelectRadioItem extends Component {
	render() {
		const { data } = this.props;
		return (<div>
			{data && data.map((item, index) => {
				let pselect = '';
				if (item.id === this.props.value) {
					pselect = 'selected';
				}
				return <div className="radio-btn" key={index}>
					<div className="flex jc-between" key={item.id} onClick={() => this.props.onChange(item.id)}>
						<div className="radio-name">{index + 1}、{item.name}</div>
						<div className={`icon ${pselect}`}></div>
					</div>
				</div>;
			})}
		</div>);
	}
}
@CSSModules(styles)
class Refund extends Component {
	constructor() {
		super();
		this.state = {
			selectAll: false, // 全选
			payType: '',
			info: {},
			isRefund: 0,
			refundConfig: [],
			allState: false,
			couponLists: [],
			refund_money: 0,
			isYuan: false,
			selectIds: [],
			isInfo: false
		};
	}
	componentDidMount() {
		this.getOrderDetails();
	}
	// 获取数据
	getOrderDetails = async () => {
		const res = await urlAPi.getOrderDetail(this.props.modelData);
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			const { item, is_open_refund, refund_description, refund_all_status, coupon_list, id } = res.result;
			this.setState({
				info: item,
				isRefund: is_open_refund,
				refundConfig: refund_description,
				allState: refund_all_status,
				couponLists: coupon_list.map((item) => { item.selcted = true; return item; }),
				selectAll: true,
				selectIds: coupon_list.map((item) => ( item.id )),
			});
			this.refundMoney(item.number);
		}
	}
	// 退款金额
	refundMoney = async (number) => {
		const { id } = this.props.modelData;
		const res1 = await urlAPi.refundMoney({ num: number, order_id: id });
		if (Object.is(res1.code, 0) && Object.is(res1.message, 'ok')) {
			this.setState({
				refund_money: res1.result.refund_money
			});
		}
	}
	// 提交退款金额
	refund = async () => {
		const { payType, selectIds } = this.state;
		const content = this.props.form.getFieldValue('content');
		if (!selectIds.length) {
			Toast.info('请选择退款券码',2);
			return false;
		}
		if(Object.is(payType,'')){
			Toast.info('请选择退款原因',2);
			return false;
		}
		const params = {
			refund_reason: payType,
			item_id: selectIds,
			content: content
		};
		Toast.info('提交退款申请中...', 4, null, false);
		const res = await urlAPi.refundSure(params);
		Toast.info(res.message, 2, null, false);
		setTimeout(() => {
			Toast.hide();
		}, 3000);
		if (Object.is(res.code, 0)) {
			subViewHandle.replaceView('payment', {
				title: '我的订单',
				modelData: {
					page: 4
				}
			});
		}
	};
	showInfo = () => {
		this.setState({
			isInfo: true
		});
	}
	cancal = () => {
		this.setState({
			isInfo: false
		});
	}
	render() {
		const { selectAll, payType, info, isRefund, refundConfig, allState, couponLists, refund_money, isYuan, selectIds, isInfo } = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<div>
				{isInfo && (
					<div className='info-boxs flex-center'>
						<div className="info-content">
							<div className="info-cont">
								<h4>温馨提示</h4>
								<p>1、如该订单已参与“大信通卡支付优惠”活动，商品平分优惠金额，退款只退还实际支付的现金部分。</p>
								<p>2、积分不予退还。</p>
								<p>3、消费所获积分，退款时将全部收回。</p>
								<div onClick={this.cancal}>知道了</div>
							</div>
						</div>
					</div>
				)}
				<div styleName="re-info" className="flex mb20">
					<div styleName="re-img"><img src={info.deal_icon} /></div>
					<div className="flex-g-1">
						<h4>{info.name}</h4>
						<div className="flex">
							<p>单价：<span>{info.unit_price}元</span></p>
							<p>付款金额：<span>{info.total_price}元</span></p>
						</div>
					</div>
				</div>
				<div styleName="re-detail">
					<div className="flex jc-between" styleName="re-head">
						<div styleName="re-price" onClick={this.showInfo}>退款金额 <span className="pl20">{refund_money}</span>元</div>
						<div className="flex-center">
							<div className="radio-box">
								<div className="flex jc-between flex-center" onClick={() => {
									this.setState({
										selectAll: !selectAll,
									});
									let ids = [];
									let arr = couponLists.map((item) => {
										item.selcted = !selectAll;
										!selectAll && ids.push(item.id);
										return item;
									});
									this.refundMoney(ids.length);
									this.setState({
										couponLists: arr,
										selectIds: ids
									});
								}}>
									<div className="mr15">全选</div>
									<div className={`icon ${selectAll ? 'selected' : ''}`}></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div styleName="re-items" className="mb20">
					<div styleName="re-item">
						{couponLists && couponLists.map((item, index) => {
							return (
								<div className="flex jc-between" key={index}>
									<div className="flex-g-1">
										<p>序列号：{item.password}</p>
										<p>时间：{item.time_str}到期</p>
										<p>状态：{item.status_str}</p>
									</div>
									<div className="mt45">
										<Radio status={item.selcted} isRefunt={item.is_refund} onChange={(select) => {
											let arr = [];
											couponLists[index].selcted ? (couponLists[index].selcted = false) : (couponLists[index].selcted = true);
											couponLists[index].selcted && selectIds.push(item.id);
											couponLists.forEach((item, index) => {
												item.selcted && arr.push(item.id);
											});
											if (arr.length !== couponLists.length) {
												this.setState({
													selectAll: false
												});
											}
											if (!!arr.length && arr.length == couponLists.length) {
												this.setState({
													selectAll: true
												});
											}
											this.refundMoney(arr.length);
											this.setState({
												couponLists: couponLists,
												selectIds: arr
											});
										}}></Radio>
									</div>
								</div>
							);
						})}

					</div>
				</div>
				<div styleName="tui-box" className="mb20">
					<h4>退款方式:</h4>
					<div>
						<div styleName="tui-item" className="flex jc-between">
							<p>原路返回<span>（3-10个工作日内退款到原支付方）</span></p>
							{/* <Radio status={isYuan} onChange={(select) => this.onChange(select)}></Radio> */}
						</div>
					</div>
				</div>
				<div styleName="re-reason" className="mb20">
					<h4>退款原因：</h4>
					<div>
						<div styleName="">
							<SelectRadioItem data={refundConfig} value={payType} onChange={(id) => { this.setState({ payType: id }); }}></SelectRadioItem>
						</div>
					</div>
				</div>
				<div styleName="re-text" className="mb20 refund-text">
					<List>
						<TextareaItem
							placeholder="请输入退款理由"
							{...getFieldProps('content') }
							rows={5}
							count={100}
						/>
					</List>
				</div>
				<div styleName="re-btn">
					<div onClick={this.refund}>提交订单</div>
				</div>
			</div>
		);
	}
}

export default createForm()(Refund);
