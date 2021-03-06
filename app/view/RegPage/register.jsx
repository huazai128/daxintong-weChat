import React, { Component } from 'react';
import { List, InputItem, Button,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import styles from './register.scss';//是导入样式是使用的--
import { codeImg } from 'utils';
import { urlAPi } from 'service/api';
import { hashHistory } from 'react-router';
import { getStore,setStore } from 'utils/store';
import TuImg from 'components/TuImg/tu';


@createForm()
@CSSModules(styles)
export default class RegisterComponent extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			phoneText: '获取验证码',
			err: {},
			timer: null,
			isPhone:false,
			isSend:false,
			codeImg:codeImg,
			disabled:false,
			imgstate: new Date().getTime(),
			isOcc:false,
			sess_id: getStore('sess_id'),
			isSpace:false
		};
	}
	// 组件销毁前触发
	componentWillUnmount(){
		clearInterval(this.state.timer);
		this.setState({timer:null,err:null,disabled:false});
	}
	// 提交
	submit = () => {
		this.props.form.validateFields((err, values) => {
			delete values.redpwd;
			if (!err) {
				this.register(values);
			}
			this.setState({ err: err || {} });
		});
	}
	// 发送验证码
	sendPhone = async () => {
		const { isSend,isPhone } = this.state;
		if(isSend || !isPhone) return false;
		const phone = this.props.form.getFieldValue('mobile');
		const res = await urlAPi.sendTest({'mobile': phone,unique:1,classtype:1});
		Toast.info(res.message, 2, null, false);
		if(Object.is(res.code,1) && Object.is(res.message,'手机号已被占用')){
			this.setState({
				isOcc:true
			});
			return false;
		}else{
			this.setState({
				isOcc:false
			});
		}
		this.setState({phoneText: '验证码已发送',isSend:true,disabled:true });
		setTimeout(() => {
			this.getTime();
		}, 3000);
	}
	// 倒计时
	getTime = () => {
		let times = 60;
		this.state.timer = setInterval(() => {
			times--;
			if (times <= 0) {
				clearInterval(this.state.timer);
				times = 60;
				this.setState({ isSend: false, phoneText: '获取验证码',disabled:false });
			} else {
				this.setState({ phoneText: times + '秒后重试' });
			}
		}, 1000);
	}
	register = async(values) => {
		const user_pwd = this.props.form.getFieldValue('user_pwd');
		const redpwd = this.props.form.getFieldValue('redpwd');
		if(!Object.is(user_pwd,redpwd)){
			this.refs.tuImg.update();
			Toast.info('输入密码不一致',2);
			return false;
		}
		if(this.state.isSpace) {
			this.refs.tuImg.update();
			Toast.info('请不要输入空格',2);
			return false;
		}
		if(this.state.isOcc){
			Toast.info('手机号已被占用请重新输入', 2, null, false);
			return false;
		}
		const res = await urlAPi.register(values);
		Toast.info(res.message, 2, null, false);
		if(Object.is(res.code,0)){
			setStore('isLogin',true);
			setStore('userId',res.sess_id);
			hashHistory.replace('/me');
		}else{
			this.refs.tuImg.update();
		}
	}
	render() {
		const { getFieldProps } = this.props.form;
		const { type,err,phoneText,isSend,codeImg,disabled,isPhone,imgstate,sess_id } = this.state;
		return (
			<div>
				<div className="form-box">
					<List>
						<div className="flex jc-between form-group">
							<div className="flex-g-1">
								<InputItem
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
									maxLength="18"
									error={err.mobile }
									disabled = {disabled}
									onFocus={() => { delete err.mobile; this.setState({}); }}
									placeholder="请输入手机号码"
									moneyKeyboardAlign="left"
								><i className="form-icon" styleName="phone"></i></InputItem>
							</div>
							<button type="button" className="from-btn" className={ isPhone ? 'is-send':'' } onClick={ () => this.sendPhone() } styleName="send-btn">{ phoneText }</button>
						</div>
						<div  className="form-group">
							<InputItem
								{...getFieldProps('sms_verify',{
									rules:[
										{ required: true,message:'' },
									]
								}) }
								type="number"
								maxLength="18"
								error={err.sms_verify }
								onFocus={() => { delete err.sms_verify; this.setState({}); }}
								placeholder="请输入验证码"
								moneyKeyboardAlign="left"
							><i className="form-icon" styleName="icon-ma"></i></InputItem>
						</div>

						<div className="form-group">
							<InputItem
								{...getFieldProps('user_pwd',{
									rules: [{ required: true }, {
										validator: (rule, value, callback) => {
											const form = this.props.form;
											let pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]');
											if(pattern.test(value)){
												Toast.info('不能输用特殊符号',2);
												callback('不能输用特殊符号');
											}
											if(value && value.lentgth >= 6){
												form.validateFields(['redpwd'], { force: true }); // 给regpassword设置force
											}
											if(value.indexOf(' ') !== -1){
												this.setState({
													isSpace: true
												});
											}else{
												this.setState({
													isSpace: false
												});
											}
											callback();
										}
									}]
								}) }
								error={err.user_pwd }
								maxLength='18'
								onFocus={() => { delete err.user_pwd; this.setState({}); }}
								placeholder="请输入密码（必须含有英文和数字）"
								type="password"
								moneyKeyboardAlign="left"
							><i className="form-icon" styleName="password"></i></InputItem>
						</div>
						<div className="form-group">
							<InputItem
								{...getFieldProps('redpwd',{
									rules: [{ required: true }, {
										validator: (rule, value, callback) => {
											const form = this.props.form;
											if (value && !Object.is(value, form.getFieldValue('user_pwd'))) {
												callback('输入的密码不一致！');
											} else {
												callback();
											}
										}
									}],
								}) }
								type="password"
								maxLength='18'
								error={err.redpwd}
								placeholder="请再次输入密码"
								onFocus={() => { delete err.redpwd; this.setState({}); }}
								moneyKeyboardAlign="left"
							><i className="form-icon" styleName="password"></i></InputItem>
						</div>
						<div className="flex jc-between form-group">
							<div className="flex-g-1">
								<InputItem
									{...getFieldProps('verify_code',{
										rules:[
											{ required: true }
										]
									}) }
									type="number"
									maxLength="18"
									error={err.verify_code}
									onFocus={() => { delete err.verify_code; this.setState({}); }}
									placeholder="请输入右图的校验码"
									moneyKeyboardAlign="left"
								><i className="form-icon" styleName="icon-ma"></i></InputItem>
							</div>
							<div className="ml20">
								<TuImg ref="tuImg"></TuImg>
							</div>

						</div>
						<div styleName='btn'
							style={{ width: '100%', textAlign: 'center' }}
							onClick={() => this.submit()}>确认</div>
					</List>
				</div>
			</div>
		);
	}
}
