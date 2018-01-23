import React, { Component } from 'react';
import { List, InputItem, Button,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import styles from './mobile.scss';//是导入样式是使用的--
import { urlAPi } from 'service/api';
import { observer, inject } from 'mobx-react';
import { codeImg } from 'utils';
import { hashHistory } from 'react-router';
import { getStore,setStore } from 'utils/store';
import TuImg from 'components/TuImg/tu';
import { subViewHandle } from 'app/components/subViewLink/subViewLink';


@createForm()
@CSSModules(styles, { allowMultiple: true })
export default class Form extends React.Component {
	state = {
		isSend:false,
		err: {},
		imgstate: new Date().getTime(),
		sess_id:getStore('sess_id'),
		isSpace:false
	}
	componentDidMount(){

	}
	// 组件销毁前触发
	componentWillUnmount(){
		this.setState({err:null});
	}
	// 登录
	submitAccount = () => {
		if(this.state.isSpace) {
			this.refs.tuImg.update();
			Toast.info('请不要输入空格',2);
			return false;
		}
		this.props.form.validateFields((err, values) => {
			if(!err){
				urlAPi.getLoginAccount(values).then((res) => {
					Toast.info(res.message, 2, null, false);
					if(Object.is(res.code,0) && Object.is(res.message,'登录成功')){
						setStore('isLogin',true);
						setStore('userId',res.sess_id);
						if(this.props.order){
							subViewHandle.pushView('order', {
								title: '提交订单',
								modelData: {
									deal_id: this.props.order,
									loginStatus: 1,
								}
							});
						}else{
							hashHistory.replace('/me');
						}
					}else{
						this.refs.tuImg.update();
					}
				});
			}
			this.setState({ err: err || {} });
		});
	}
	render() {
		this.props.order;
		const { getFieldProps } = this.props.form;
		const { err,type,imgstate,sess_id } = this.state;
		return (
			<div styleName="from-box">
				<form>
					<div className="flex" styleName='topinput'>
						<div className="flex-g-1">
							<InputItem className="no-margin" styleName='phonetop'
								{...getFieldProps('user_key',{
									rules:[
										{ required:true,message:'请输入您的账号' },
										{ validator:(rule,value,callback) => {
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
										}}
									]
								}) }
								error={err.mobile}
								maxLength="18"
								placeholder="请输入手机号码/邮箱/用户名"
								moneyKeyboardAlign="left"
							><i styleName="shouji"></i></InputItem>
						</div>
					</div>
					<div styleName='message'>
						<InputItem styleName='messageone'
							{...getFieldProps('user_pwd',{
								rules:[
									{ required:true,message:'请输入您的密码' },
								]
							}) }
							type="password"
							maxLength="18"
							placeholder="请输入密码"
							moneyKeyboardAlign="left"
						><i styleName="suo"></i></InputItem>
					</div>
					<div styleName='xiaoyanma' className="flex ">
						<div className="flex-g-1">
							<InputItem styleName='xiaoone'
								{...getFieldProps('verify_code',{
									rules:[
										{ required:true,message:'请输入验证码' }
									]
								}) }
								maxLength="18"
								placeholder="请输入右图的校验码"
								moneyKeyboardAlign="left"
								type="number"
							><i styleName="ma"></i></InputItem>
						</div>
						<TuImg ref="tuImg"></TuImg>
					</div>
					<div className="pr20 pl20">
						<div styleName='btn'
							style={{ width: '100%', textAlign: 'center' }}
							onClick={() => this.submitAccount()}>登录</div>
					</div>
				</form>
			</div>
		);
	}
}
