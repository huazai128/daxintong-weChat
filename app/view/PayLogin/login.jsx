import React, { Component } from 'react';
import { urlAPi } from 'service/api';
import { Toast } from 'antd-mobile';
import { hashHistory } from 'react-router';
import { setStore,removeStore } from 'utils/store';
import { SubViewLink,subViewHandle } from 'app/components/subViewLink/subViewLink';
import './login.scss';

class PayLogin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLogin: 0,
			nickname: '',
			headimg: '',
			sess_id:'',
			deal_id:''
		};
	}
	componentDidMount() {
		if(this.props.location && this.props.location.query){
			const { deal_id } = this.props.location.query;
			if(deal_id){
				this.setState({
					deal_id:deal_id
				});
			}
		}
		this.getWxInfo();
	}
	getWxInfo = async () => {
		let deal_id = this.state.deal_id;
		const res = await urlAPi.wxInfo();
		if (Object.is(res.code, 0)) {
			const { is_register, headimg, nickname } = res.result;
			if(Object.is(is_register, 1)){
				this.setState({
					isLogin: is_register,
					headimg: headimg,
					nickname: nickname,
					sess_id:res.sess_id
				});
			}else{
				subViewHandle.replaceView('wxLogin',{
					title:'绑定手机号码',
					modelData: {
						deal_id: deal_id,
					}
				});
			}
		}else{
			Toast.info('微信绑定失败',2);
			subViewHandle.pushView('order', {
				title: '提交订单',
				modelData: {
					deal_id: deal_id,
					loginStatus: 0,
				}
			});
		}
	}
	// 登录
	login = async (isLogin,sess_id) => {
		let deal_id = this.state.deal_id;
		if (Object.is(isLogin, 1)) {
			const res = await urlAPi.getWeixinstatus();
			Toast.info(res.message, 2, null, false);
			removeStore('wxLogin');
			if(Object.is(res.code,0)){
				if(Object.is(res.result.is_jump_mobile,0)){
					setStore('isLogin',true);
					setStore('userId',sess_id);
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
					subViewHandle.replaceView('wxLogin',{
						title:'绑定手机号码',
						modelData: {
							deal_id: deal_id,
						}
					});
				}
			}
		}
	}
	render() {
		const { isLogin, headimg, nickname,sess_id,deal_id } = this.state;
		return (
			<div className="bots-box">
				{ Object.is(isLogin, 1) && (
					<div >
						<div className="boxs-avatar"><img src={headimg} /></div>
						<p>您的微信账号已绑定以上大信通账号是否直接登录?</p>
						<div className="boxs-btns">
							<div className="sure" onClick={() => { this.login(isLogin,sess_id); }}>确认</div>
							<div onClick={ () => {hashHistory.push('/login?deal_id=' + deal_id);}}>用其他大信通账号登录</div>
						</div>
					</div>
				) }
			</div>
		);
	}
}
export default PayLogin;
