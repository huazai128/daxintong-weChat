import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import './password.global.scss';//是导入样式是使用的--
import { List, InputItem, WhiteSpace, Icon,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { codeImg } from 'utils';
import { urlAPi } from 'service/api';
import { getStore } from 'utils/store';
import { hashHistory } from 'react-router';
import TuImg from 'components/TuImg/tu';

@createForm()
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			err: {},
			imgstate: new Date().getTime(),
			sess_id: getStore('userId'),
			isSpace:false
		};
	}
	submit = () => {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.revisePassword(values);
			}
			this.setState({ err: err || {} });
		});
	}
	revisePassword = async (valus) => {
		if(this.state.isSpace) {
			this.refs.tuImg.update();
			Toast.info('请不要输入空格',2);
			return false;
		}
		const res = await urlAPi.revisePassword(valus);
		Toast.info(res.message, 2, null, false);
		if(Object.is(res.code,0) && Object.is(res.message,'密码修改成功')){
			hashHistory.goBack();
		}else{
			this.refs.tuImg.update();
		}
	}
	render() {
		const { getFieldProps } = this.props.form;
		const { err, imgstate,sess_id } = this.state;
		return (
			<div id="password">
				<div className="psd">
					<List>
						<InputItem className='flex-vcenter psdInput'
							{...getFieldProps('user_pwd', {
								rules: [
									{ required: true, message: '请输入密码' },
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
							type="password"
							placeholder="请输入当前密码"
							clear
							moneyKeyboardAlign="left"
						><i className="psdContent"></i></InputItem>
						<InputItem className='flex-vcenter psdInput padMargin'
							{...getFieldProps('new_pwd', {
								rules: [{ required: true }, {
									validator: (rule, value, callback) => {
										const form = this.props.form;
										if (value && value.lentgth >= 6) {
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
							error={err.new_pwd}
							onFocus={() => { delete err.new_pwd; this.setState({}); }}
							placeholder="请输入6到18位的密码（必须含有英文和数字）"
							type="password"
							moneyKeyboardAlign="left"
							clear
							moneyKeyboardAlign="left"
						><i className="psdContent"></i></InputItem>

						<InputItem className='flex-vcenter psdInput padMargin'
							{...getFieldProps('redpwd', {
								rules: [{ required: true }, {
									validator: (rule, value, callback) => {
										const form = this.props.form;
										if (value && !Object.is(value, form.getFieldValue('new_pwd'))) {
											callback('输入的密码不一致！');
										} else {
											callback();
										}
									}
								}],
							}) }
							type="password"
							error={err.redpwd}
							onFocus={() => { delete err.redpwd; this.setState({}); }}
							moneyKeyboardAlign="left"
							placeholder="请再次输入密码"
							clear
							moneyKeyboardAlign="left"
						><i className="psdContent"></i></InputItem>

						<div className="flex jc-between mt20 xiaoyanma phoInput padMargin">
							<div className="flex-g-1">
								<InputItem className='xiaoone'
									{...getFieldProps('verify_code', {
										rules: [
											{ required: true, message: '验证码' }
										]
									}) }
									type="number"
									placeholder="请输入右图的校验码"
									moneyKeyboardAlign="left"
								><i className="psdComfir"></i></InputItem>
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
							点击提交
						</div></div>
				</div>
			</div>
		);
	}
}
