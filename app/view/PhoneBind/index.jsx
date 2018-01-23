import React, { Component } from 'react';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import './phoneBind.global.scss';//是导入样式是使用的--
import { List, InputItem, WhiteSpace, Icon,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { urlAPi } from 'service/api';
import { codeImg } from 'utils';
import { hashHistory } from 'react-router';
import { getStore } from 'utils/store';
import TuImg from 'components/TuImg/tu';


@createForm()
export default class extends Component {
	constructor(props){
		super(props);
		this.state = {
			isSend:false,
			err: {},
			timer: null,
			phoneText: '获取验证码',
			isSubmit:false,
			isPhone:false,
			disabled:false,
			imgstate: new Date().getTime(),
			sess_id:getStore('userId')
		};
	}
	submit =  () => {
		this.props.form.validateFields((err, values) => {
			if(!err){
				this.resetMobel(values);
			}
			this.setState({ err: err || {} });
		});
	}
	//
	resetMobel = async (valeus) => {
		const res = await urlAPi.resetMobel(valeus);
		Toast.info(res.message, 2, null, false);
		if(Object.is(res.code,0)){
			hashHistory.goBack();
		}else{
			this.refs.tuImg.update();
		}
	}
	// 获取验证码
	sendPhone = async () =>{
		const { isSend,isPhone } = this.state;
		if(isSend || !isPhone) return false;
		const phone = this.props.form.getFieldValue('new_mobile');
		const res = await urlAPi.sendTest({'mobile': phone,unique:1,classtype:4});
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
	componentWillUnmount(){
		clearInterval(this.state.timer);
		this.setState({timer:null});
	}
	// 提交手机登录
	submitPhone = () => {
		this.props.form.validateFields((err, values) => {
			if(!err){
				this.store.getLoginMobile(values);
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
		const { oldMobile }  = this.props.modelData;
		return (
			<div id="phoneBind">
				<div className="pho">
					<List>
						<InputItem className='flex-vcenter phoInput'
							{...getFieldProps('mobile',{
								initialValue:oldMobile,
							}) }
							type="number"
							maxLength='18'
							error={err.mobile}
							disabled= {true}
							onFocus={() => { delete err.mobile; this.setState({err:err}); }}
							moneyKeyboardAlign="left"
							placeholder="请输入当前绑定的手机号"
							clear
							moneyKeyboardAlign="left"
						><i className="phoContent"></i></InputItem>
						<InputItem className='flex-vcenter phoInput padMargin'
							{...getFieldProps('new_mobile',{
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
							maxLength='18'
							error={err.mobile}
							disabled= {disabled}
							onFocus={() => { delete err.mobile; this.setState({err:err}); }}
							moneyKeyboardAlign="left"
							placeholder="请输入新的手机号"
							clear
						><i className="phoContent"></i></InputItem>

						<div className="flex jc-between xiaoyanma phoInput padMargin">
							<div className="flex-g-1">
								<InputItem className='xiaoone'
									{...getFieldProps('sms_verify',{
										rules:[
											{required: true,message:'验证码'}
										]
									}) }
									type="number"
									maxLength="18"
									placeholder="请输入验证码"
									moneyKeyboardAlign="left"
								><i className="ma"></i></InputItem>
							</div>
							<div className={ `send-mobile ${isPhone ? 'send':''}` } onClick={ () => this.sendPhone()}>{ phoneText }</div>
						</div>
						<div className="flex jc-between xiaoyanma phoInput padMargin">
							<div className="flex-g-1">
								<InputItem className='xiaoone'
									{...getFieldProps('verify_code',{
										rules:[
											{required: true,message:'验证码'}
										]
									}) }
									type="number"
									maxLength="18"
									placeholder="请输入右图的校验码"
									moneyKeyboardAlign="left"
								><i className="ma"></i></InputItem>
							</div>
							<div className="ml20">
								<TuImg ref="tuImg"></TuImg>
							</div>
						</div>
					</List>
					<div className="bottomBtn">
						<div className='btn'
							style={{ width: '100%', textAlign: 'center', marginBottom: '50px' }}
							onClick={() => this.submit()}>
							确认
						</div></div>
				</div>
			</div>
		);
	}
}
