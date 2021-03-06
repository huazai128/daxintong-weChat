import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Carousel, WhiteSpace, WingBlank, NavBar, Icon, List, InputItem, Button, Toast, Stepper } from 'antd-mobile';
import { createForm } from 'rc-form';
import Step from 'components/Stepper';
import Switch from 'components/Switch';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import styles from './order.scss';//是导入样式是使用的--
import { SubViewLink, subViewHandle } from 'app/components/subViewLink/subViewLink';
import { urlAPi } from 'service/api';
import { hashHistory } from 'react-router';
import { codeImg } from 'utils';
import { getStore, setStore } from 'utils/store';
import TuImg from 'components/TuImg/tu';
import { API_HOST } from 'utils';

@observer
@createForm()
@CSSModules(styles)
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			number: 1,
			loginStatus: 0,
			err: {},
			disabled: false,
			isSend: false,
			timer: null,
			phoneText: '获取验证码',
			isSubmit: false,
			isPhone: false,
			is_point: 0, //使用大信通积分
			isVoucher: 0, // 是否开始抵用券
			cart_info: {},
			dxtg_point: 0,
			has_ecv: 0,
			voucher_list: [],
			feeinfo: [],
			isBtn: false,
			ecvsn: '',
			imgstate: new Date().getTime(),
			sess_id: getStore('sess_id'),
			isShow: false,
			showBtn: false,
			dxtg_point_str: '',
		};
		this.store = this.props.modelData.store;
	}
	componentDidMount() {
		this.initData();
	}
	initData = async () => {
		const { modelData: { deal_id }, } = this.props;
		this.setState({
			loginStatus: (JSON.parse(getStore('isLogin')) ? 1 : 0),
		});
		await this.getOrder({ deal_id: deal_id });
		await this.getPrices(1, '', this.state.s_point);
		this.setState({
			isShow: true,
		});
	}
	// 提交订单
	getOrder = async (data) => {
		if (JSON.parse(getStore('isLogin'))) {
			// 已登录
			const res = await urlAPi.submitOnOrder(Object.assign(data, { number: this.state.number }));
			if (!Object.is(res.message, 'ok')) {
				Toast.info(res.message, 2);
			}
			if (Object.is(res.code, 0)) {
				const { cart_info, dxtg_point, has_ecv, voucher_list } = res.result;
				this.setState({
					cart_info: cart_info,
					dxtg_point: dxtg_point,
					has_ecv: has_ecv,
					voucher_list: voucher_list
				});
			}
		} else {
			//未登录
			const res = await urlAPi.submitOrder(data);
			if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
				const { cart_info } = res.result;
				this.setState({
					cart_info: cart_info,
				});
			}
		}
	}
	// 数量改变
	changes = (value) => {
		const { ecvsn, is_point } = this.state;
		// Toast.loading('请求数据中...', 1);
		this.setState({
			number: value,
		});
		this.getPrices(value, ecvsn, is_point);
	}
	// 获取价格列表
	getPrices = async (value, ecvsn, is_point) => {
		const { modelData: { deal_id } } = this.props;
		if (Object.is(deal_id, undefined)) return false;
		const params = {
			deal_id: deal_id,
			number: (value),
			ecvsn: ecvsn || '',
			is_point: is_point
		};
		const res = await urlAPi.countOrder(params);
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			this.setState({
				feeinfo: res.result.feeinfo,
				dxtg_point_str: res.result.dxtg_point_str
			});
		}
		this.setState({
			showBtn: true
		});
	}
	// 是否使用积分
	swiperChecked = async (value) => {
		const isVoucher = value ? 1 : 0;
		const { voucher_list, number, is_point, ecvsn } = this.state;
		let sn = value ? ecvsn : '';
		if (value) {
			voucher_list.map((item) => item.active = false);
		}
		this.setState({
			isVoucher: isVoucher,
			voucher_list: voucher_list,
			ecvsn: sn
		});
		this.getPrices(number, '', is_point);
	}
	// 获取验证码
	sendPhone = async () => {
		const { isSend, isPhone } = this.state;
		if (isSend || !isPhone) return false;
		this.setState({ phoneText: '验证码已发送', isSend: true, disabled: true });
		const phone = this.props.form.getFieldValue('mobile');
		const res = await urlAPi.sendTest({ 'mobile': phone, unique: 0, classtype: 3 });
		Toast.info(res.message, 2, null, false);
		setTimeout(() => {
			this.getTime();
		}, 3000);
	}
	// 提交手机登录
	userLogin = async () => {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.login(values);
			}
			this.setState({ err: err || {} });
		});
	}
	// 登录
	login = async (values) => {
		const res = await urlAPi.getLoginMobile(values);
		Toast.info(res.message, 2, null, false);
		if (Object.is(res.code, 0) && Object.is(res.message, '登录成功')) {
			setStore('isLogin', true);
			setStore('userId', res.sess_id);
			this.initData();
			this.setState({
				loginStatus: 1
			});
		} else {
			this.refs.tuImg.update();
		}
	}
	// 倒计时
	getTime = () => {
		let times = 60;
		this.state.timer = setInterval(() => {
			times--;
			if (times <= 0) {
				clearInterval(this.state.timer);
				times = 60;
				this.setState({ sendState: false, isSend: false, phoneText: '获取验证码', disabled: false });
			} else {
				this.setState({ phoneText: times + '秒后重试' });
			}
		}, 1000);
	}
	// 提交订单
	order = async () => {
		const { is_point, number, isBtn, ecvsn, voucher_list } = this.state;
		const { modelData: { deal_id } } = this.props;
		Toast.info('加载数据中...', 2, null, false);
		if (Object.is(Number(number), 0)) {
			Toast.info('数量不能为空', 2);
			return false;
		}
		const params = {
			deal_id: deal_id,
			number: number,
			ecvsn: ecvsn,
			is_point: is_point
		};
		if (!voucher_list && Object.is(is_point, 1)) {
			Toast.info('无优惠信息', 2);
			this.setState({
				is_point: 0
			});
			return false;
		}
		const res = await urlAPi.addOrder(params);
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			if (Object.is(res.result.pay_status, 1)) {
				hashHistory.push(`payed/${res.result.order_id}`);
			} else {
				subViewHandle.pushView('pay', {
					title: '支付订单',
					modelData: {
						order_id: res.result.order_id
					}
				});
			}
		} else {
			Toast.info(res.message, 2, null, false);
		}
	}
	componentWillUnmount() {
		clearInterval(this.state.timer);
		this.setState({ timer: null });
	}
	// 选择优惠方式
	select = (item, index) => {
		const { modelData: { deal_id } } = this.props;
		Toast.info('获取数据中...', 1, null, false);
		let { voucher_list, number, is_point } = this.state;
		if (item.active) return false;
		voucher_list.map((noc) => noc.active = false);
		voucher_list[index].active = true;
		this.setState({
			voucher_list: voucher_list,
			ecvsn: item.sn,
			showBtn: false
		});
		// this.getOrder({ deal_id: deal_id });
		this.getPrices(number, item.sn, is_point);
	}
	// 使用微信登录
	wxLogin = () => {
		const { modelData: { deal_id }, } = this.props;
		let redirect_url = location.href.split('#')[0];
		const url = encodeURIComponent(`${redirect_url}#/payLogin?deal_id=${deal_id}`);
		const sess_id = getStore('sess_id');
		window.location.href = `${API_HOST}?ctl=synclogin&act=oauth&sess_id=${sess_id}&redirect_url=${url}`;
	}
	// 使用大信通积分
	selectPoint = (value) => {
		const is_point = value ? 1 : 0;
		const { ecvsn, number, voucher_list } = this.state;
		let sn = value ? ecvsn : '';
		if (value) {
			voucher_list.map((item) => item.active = false);
		}
		this.setState({
			is_point: is_point,
			voucher_list: voucher_list,
			ecvsn: sn,
			showBtn: false
		});
		this.getPrices(number, sn, is_point);
	}
	render() {
		const { form: { getFieldProps }, modelData: { deal_id } } = this.props;
		const { showBtn, loginStatus, err, isPhone, disabled, phoneText, dxtg_point_str, cart_info, voucher_list, dxtg_point, has_ecv, feeinfo, is_point, sess_id, imgstate, isVoucher } = this.state;
		return (
			<div className="order-box">
				<div className="flex-g-1 scroll-absolute">
					<div>
						<div className="flex jc-between" styleName='ordertop'>
							<div className="leftorder flex flex-g-1">
								<div styleName="orders-img"><img src={cart_info.icon ? cart_info.icon : require('images/index01.jpg')} /></div>
								<div className="flex-g-1" styleName="ordercenter">
									<div styleName="shop-name">
										<h4 styleName="orderh4">{cart_info.name}</h4>
										<p styleName='money'>￥{cart_info.unit_price}</p>
									</div>
									<div className='flex wrap' styleName="order-sty">
										{cart_info && cart_info.deal_tags && cart_info.deal_tags.map((item, index) => {
											return (<div styleName="mianone" key={index} className="mr15">{item}</div>);
										})}
									</div>
								</div>
							</div>
						</div>
						<div className="order-bg mb20">
							<Step min={cart_info.min} max={cart_info.max} change={(value) => this.changes(value)}></Step>
							{Object.is(loginStatus, 1) && !Object.is(dxtg_point_str, '') && <Switch flag={Object.is(is_point, 1) ? true : false} point={dxtg_point} info={dxtg_point_str} onChange={(value) => this.selectPoint(value)} ></Switch>}
							{Object.is(loginStatus, 1) && voucher_list.length > 0 && Object.is(has_ecv, 1) && <Switch flag={Object.is(isVoucher, 1) ? true : false} point={dxtg_point} info='使用抵用券' onChange={(value) => this.swiperChecked(value)} ></Switch>}
						</div>
						{Object.is(loginStatus, 1) && Object.is(has_ecv, 1) && (
							<div>
								{
									Object.is(isVoucher, 1) && (
										voucher_list.length > 0 && voucher_list.map((item, index) => (
											<div className="flex jc-between" key={index} styleName='jifen'>
												<div styleName="jifencontent" className="flex jc-between">
													<div className="leftquan">{item.name}</div>
													<div className={`order-radio ${item.active ? 'active' : ''}`} onClick={() => { this.select(item, index); }}></div>
												</div>
											</div>
										))
									)
								}
							</div>
						)}
						<div>
							{feeinfo.length > 0 && feeinfo.map((item, index) => {
								return (
									<div className="flex jc-between" key={index} styleName='jine'>
										<div styleName="jinercontent" className="flex jc-between">
											<div className="leftquan">{item.name}</div>
											<div styleName="tiao">{item.value}</div>
										</div>
									</div>
								);
							})
							}
						</div>
						{Object.is(loginStatus, 0) && (
							<div styleName="form-obdsder">
								<List>
									<div className="flex jc-between" styleName='topinput'>
										<div className="flex-g-1">
											<InputItem styleName='phonetop'
												{...getFieldProps('mobile', {
													rules: [
														{ required: true, message: '请输入您的手机号码' },
														{ pattern: /^((1[3-8][0-9])+\d{8})$/, message: '请填写正确的手机号码' },
														{
															validator: (rule, value, callback) => {
																if (/^((1[3-8][0-9])+\d{8})$/.test(value)) {
																	this.setState({ isPhone: true });
																} else {
																	clearInterval(this.state.timer);
																	this.setState({ isPhone: false, phoneText: '获取验证码', timer: null, isSend: false });
																}
																callback();
															}
														}
													]
												}) }
												type="number"
												maxLength="18"
												error={err.mobile}
												onFocus={() => { delete err.mobile; this.setState({ err: err }); }}
												placeholder="请输入手机号码"
												moneyKeyboardAlign="left"
											><i styleName="shouji"></i></InputItem>
										</div>
										<button type="button" styleName="send-btn" className={isPhone ? 'sends' : ''} onClick={() => this.sendPhone()}>{phoneText}</button>
									</div>
									<div styleName='message'>
										<InputItem styleName='one'
											{...getFieldProps('sms_verify', {
												rules: [
													{ required: true, message: '请填写验证码' }
												]
											}) }
											type="number"
											maxLength="18"
											moneyKeyboardAlign="left"
											error={err.sms_verify}
											placeholder="请输入验证码"
										><i styleName="suo"></i></InputItem>
									</div>
									<div styleName='xiaoyanma' className="flex jc-between">
										<div className="flex-g-1">
											<InputItem styleName='xiaoone'
												{...getFieldProps('verify_code', {
													rules: [
														{ required: true, message: '请填写验证码' },
													]
												}) }
												type="number"
												maxLength="18"
												error={err.verify_code}
												placeholder="请输入右图的校验码"
												moneyKeyboardAlign="left"
											><i styleName="ma"></i></InputItem>
										</div>
										<TuImg ref="tuImg"></TuImg>
									</div>
								</List>
								<div styleName='pay-btn'>
									<p onClick={this.userLogin} styleName={showBtn ? 'show-btn' : ''}>登录</p>
								</div>
								<div className="order-router flex">
									<p>已有大信通账号也可以去</p>
									<div className="order-login" onClick={this.wxLogin}>登录</div>
									<div className="order-login"><SubViewLink moduleName='register' title="注册">注册</SubViewLink></div>
								</div>
							</div>
						)}
						{Object.is(loginStatus, 1) && (
							<div styleName='pay-btn '>
								<p onClick={this.order} styleName={showBtn ? 'show-btn' : ''}>提交订单</p>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
