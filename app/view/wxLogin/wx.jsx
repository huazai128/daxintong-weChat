import React, { Component } from 'react';
import { List, InputItem, Button,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import styles from './wx.scss';//是导入样式是使用的--
import { urlAPi } from 'service/api';
import { observer, inject } from 'mobx-react';
import { codeImg } from 'utils';
import { hashHistory } from 'react-router';
import { getStore,setStore } from 'utils/store';
import { SubViewLink,subViewHandle } from 'app/components/subViewLink/subViewLink';
import TuImg from 'components/TuImg/tu';

@createForm()
@CSSModules(styles, { allowMultiple: true })
export default class Form extends React.Component {
	state = {
		isSend:false,
		err: {},
		timer: null,
		phoneText: '获取验证码',
		isSubmit:false,
		isPhone:false,
		disabled:false,
		imgstate: new Date().getTime(),
		sess_id:getStore('sess_id'),
		deal_id:''
	}
	// 初始化触发
	componentDidMount(){
		if(this.props.modelData && this.props.modelData.deal_id){
			this.setState({
				deal_id:this.props.modelData.deal_id
			});
		}
	}
	// 组件销毁前触发
	componentWillUnmount(){
		clearInterval(this.state.timer);
		this.setState({err:null,timer:null,disabled:false});
	}
	// 获取验证码
	sendPhone = async () =>{
		const { isSend,isPhone } = this.state;
		if(isSend || !isPhone) return false;
		this.setState({phoneText: '验证码已发送',isSend:true,disabled:true });
		const phone = this.props.form.getFieldValue('mobile');
		setTimeout(() => {
			this.getTime();
		}, 3000);
		const res = await urlAPi.sendTest({'mobile': phone,unique:0,classtype:3});
		Toast.info(res.message, 2, null, false);
		Toast.hide();
	}
	// 提交手机登录
	submitPhone = () => {
		const deal_id = this.state.deal_id;
		this.props.form.validateFields((err, values) => {
			if(!err){
				urlAPi.wxLogin(values).then((res) => {
					Toast.info(res.message, 2, null, false);
					if(Object.is(res.code,0) && Object.is(res.message,'登录成功')){
						setStore('isLogin',true);
						setStore('userId',res.sess_id);
						if(deal_id){
							subViewHandle.pushView('order', {
								title: '提交订单',
								modelData: {
									deal_id: deal_id,
									loginStatus: 1,
								}
							});
						}else{
							hashHistory.push('/me');
						}
					}else{
						this.refs.tuImg.update();
					}
				});
			}
			this.setState({ err: err || {} });
		});
	}
	// 倒计时
	getTime = () => {
		let times = 60;
		this.state.timer = setInterval(() => {
			times--;
			if (times <= 0) {
				clearInterval(this.state.timer);
				times = 60;
				this.setState({ sendState: false,isSend: false, phoneText: '获取验证码',disabled:false });
			} else {
				this.setState({ phoneText: times + '秒后重试' });
			}
		}, 1000);
	}
	render() {
		const { getFieldProps } = this.props.form;
		const { type,isSend,err,phoneText,isPhone,disabled,imgstate,sess_id } = this.state;
		return (
			<div styleName="from-box">
				<div className="flex" styleName='topinput'>
					<div className="flex-g-1">
						<InputItem styleName='phonetop'
							{...getFieldProps('mobile',{
								rules:[
									{ required: true,message:'请输入您的手机号码' },
									{ pattern:/^((1[3-8][0-9])+\d{8})$/,message:'请填写正确的手机号码'},
									{ validator:(rule,value,callback) => {
										if(/^((1[3-8][0-9])+\d{8})$/.test(value)){
											this.setState({isPhone:true});
										}else{
											clearInterval(this.state.timer);
											this.setState({isPhone:false, phoneText: '获取验证码',timer:null,isSend:false });
										}
										callback();
									}}
								]
							}) }
							type="number"
							error={err.mobile}
							disabled= {disabled}
							onFocus={() => { delete err.mobile; this.setState({err:err}); }}
							placeholder="请输入手机号码"
							moneyKeyboardAlign="left"
						><i styleName="shouji"></i></InputItem>
					</div>
					<button type="button" styleName="yanzheng" className={ isPhone ? 'send':'' } onClick={ () => this.sendPhone()}>{phoneText}</button>
				</div>
				<div styleName='message'>
					<InputItem styleName='messageone'
						{...getFieldProps('sms_verify',{
							rules:[
								{ required: true,message:'请填写验证码' }
							]
						}) }
						type="number"
						error={err.sms_verify}
						placeholder="短信验证"
						moneyKeyboardAlign="left"
					><i styleName="suo"></i></InputItem>
				</div>
				<div styleName='xiaoyanma' className="flex ">
					<div className="flex-g-1">
						<InputItem styleName='xiaoone'
							{...getFieldProps('verify_code',{
								rules:[
									{ required: true,message:'请填写验证码' },
								]
							}) }
							error={err.verify_code}
							placeholder="请输入校验码"
							moneyKeyboardAlign="left"
							type="number"
						><i styleName="ma"></i></InputItem>
					</div>
					<TuImg ref="tuImg"></TuImg>
				</div>
				<div className="pr20 pl20">
					<div styleName='btn' style={{ width: '100%', textAlign: 'center' }}
						onClick={() => this.submitPhone()} >登录</div>
				</div>
			</div>
		);
	}
}
