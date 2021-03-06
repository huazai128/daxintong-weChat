import React, { Component } from 'react';
import styles from './information.scss';
import Nav from 'components/Navthree';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import { urlAPi } from 'service/api';
import { hashHistory } from 'react-router';
import { removeStore, getStore, setStore } from 'utils/store';
import { SubViewLink, subViewHandle } from 'app/components/subViewLink/subViewLink';
import { List, InputItem, WhiteSpace, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { observer, inject } from 'mobx-react';
import { API_HOST } from 'utils';


@createForm()
@CSSModules(styles)
@observer
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user_name: '',
			user_email: '',
			user_mobile: '',
			wx_is_binding: 0,
			isUnBind: false,
			info: {},
			isUser: false,
			isEmail: false
		};
	}
	componentDidMount() {
		this.getInformation();
	}
	// 绑定微信
	bindWeixin = async (value) => {
		if (Object.is(value, 0)) {
			setStore('bindWx', true);
			let redirect_url = location.href.split('#')[0];
			const url = encodeURIComponent(`${redirect_url}#/me`);
			const sess_id = getStore('sess_id');
			window.location.href = `${API_HOST}?ctl=synclogin&act=oauth&sess_id=${sess_id}&redirect_url=${url}`;
		} else {
			// 取消绑定
			this.setState({
				isUnBind: true
			});
		}
	}
	// 绑定
	bindWx = async () => {
		const res = await urlAPi.bindWx({});
		Toast.info(res.message, 5);
	}
	// 退出登录
	clickQuit = () => {
		urlAPi.getQuit({ id: this.props.modelData.id }).then((res) => {
			Toast.info(res.message, 2, null, false);
			hashHistory.push('/');
			removeStore('isLogin');
			removeStore('expired');
		});
	}
	// 修改用户名
	reviseUsername = async (value) => {
		const user_name = this.props.form.getFieldValue('user_name');
		const { user_name: name } = this.state;
		if (!Object.is(user_name, undefined) && !Object.is(name, user_name)) {
			const res = await urlAPi.reviseUsername({ user_name: user_name });
			Toast.info(res.message, 2, null, false);
			this.getInformation();
		} else if(Object.is(name, user_name)) {
			Toast.info('输入的用户名一致', 2, null, false);
		}else{
			Toast.info('请输入正确的用户名', 2, null, false);
		}
		this.setState({
			isUser: false
		});
	}
	// 修改email
	reviseEmail = async (value) => {
		const email = this.props.form.getFieldValue('email');
		const { user_email } = this.state;
		if (!Object.is(email, undefined) && !Object.is(user_email, email) && /[a-z0-9-.]{1,30}@[a-z0-9-]{1,65}.(com|net|org|info|biz|([a-z]{2,3}.[a-z]{2}))/.test(email)) {
			const res = await urlAPi.reviseEmail({ email: email });
			Toast.info(res.message, 2, null, false);
			this.getInformation();
		} else {
			this.props.form.setFieldsValue({
				email: value
			});
			Toast.info('请输入正确的邮箱格式', 2, null, false);
		}
		this.setState({
			isEmail: false
		});
	}
	// 获取个人资料
	getInformation = async () => {
		const { id } = this.props.modelData;
		const res = await urlAPi.getInformation({ id: id });
		if (Object.is(res.code, 0)) {
			const { user_name, user_email, user_mobile, wx_is_binding } = res.result;
			this.setState({
				user_name: user_name,
				user_email: user_email,
				user_mobile: user_mobile,
				wx_is_binding: wx_is_binding,
				info: res.result
			});
		}
	}
	// 取消
	cancel = () => {
		this.setState({
			isUnBind: false
		});
	}
	// 确认
	confirm = async () => {
		const res = await urlAPi.unBindWx({});
		Toast.info(res.message, 2, null, false);
		if (Object.is(res.code, 0)) {
			this.getInformation();
		}
		this.setState({
			isUnBind: false
		});
	}
	render() {
		const { user_name, user_email, user_mobile, wx_is_binding, isUnBind, info, isUser, isEmail } = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<div className="infor-box">
				{isUnBind && (
					<div className="info-tan flex-center">
						<div>
							<div className="tan-box">
								<h4>提示</h4>
								<p>你确定要解绑微信?</p>
								<div className="btns flex">
									<div className="flex-g-1" onClick={this.cancel}>取消</div>
									<div className="flex-g-1" onClick={this.confirm}>确认</div>
								</div>
							</div>
						</div>
					</div>
				)}
				<List>
					<div className="mb95" styleName="info-box">
						<div styleName="info-items">
							<div className="flex" styleName="info-item">
								<div className="flex-col-3">用户名</div>
								<div className="flex-col-7">
									<InputItem
										value={user_name}
										{...getFieldProps('user_name', {
											initialValue: user_name,
											rules: [
												{
													validator: (rule, value, callback) => {
														this.setState({
															isUser: true
														});
														callback();
													}
												}
											]
										}) }
									></InputItem></div>
								{ isUser && (<div className="text-right flex-col-2" onClick={() => { this.reviseUsername(info.user_name); }}>确认</div>) }
							</div>
							<div className="flex" styleName="info-item">
								<div className="flex-col-3">邮箱</div>
								<div className="flex-col-7">
									<InputItem
										{...getFieldProps('email', {
											initialValue: user_email,
											rules: [
												{
													validator: (rule, value, callback) => {
														this.setState({
															isEmail: true
														});
														callback();
													}
												}
											]
										}) }
									></InputItem></div>
								{ isEmail && (<div className="text-right flex-col-2" onClick={() => { this.reviseEmail(info.user_email); }}>确认</div>) }

							</div>
						</div>
						<div styleName="info-items">
							<SubViewLink moduleName="mobile" title="绑定手机号" modelData={{ oldMobile: user_mobile }} >
								<div className="flex" styleName="info-item" style={{ borderBottom: '1px solid #ddd' }}>
									<div className="flex-col-3">已绑定手机</div>
									<div className="flex-col-6">{user_mobile}</div>
									<div className="flex-col-3" styleName="more">更换</div>
								</div>
							</SubViewLink>
							<SubViewLink moduleName="password" title="修改密码">
								<div className="flex" styleName="info-item">
									<div className="flex-col-12">修改密码</div>
								</div>
							</SubViewLink>
						</div>
						<div styleName="info-items">
							<div className="flex jc-between" styleName="info-item">
								<div className="flex-col-3">微信绑定</div>
								<div className="flex-col-9" styleName="more" onClick={() => { this.bindWeixin(wx_is_binding); }}>{Object.is(wx_is_binding, 0) ? '未绑定' : '已绑定'}</div>
							</div>
						</div>
					</div>
				</List>
				<div styleName="info-btn">
					<button type='button' onClick={this.clickQuit}>退出当前登录</button>
				</div>
			</div>
		);
	}
}

