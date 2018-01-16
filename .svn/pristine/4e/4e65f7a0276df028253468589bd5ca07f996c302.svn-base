import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { TabBar, Modal, Toast } from 'antd-mobile';
import { observer, inject } from 'mobx-react';
import './footer.scss';
import { getStore,removeStore } from 'utils/store';

@inject('login')
@observer
class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLogin:true,
		};
		this.store = this.props.login;
	}
	// 初始化触发
	componentDidMount(){
		this.setState({
			isLogin:getStore('isLogin') === 'true' ? true : false
		});
	}
	// 组件销毁前触发
	componentWillUnmount(){

	}
	render() {
		let pathname = this.props.pathname;
		const flag = JSON.parse(getStore('isLogin'));
		return (
			<div id="footer" className="flex-center">
				<div className={'item flex-g-1 flex-col-center' + (pathname === '' ? ' active' : '')} onClick={() => {
					hashHistory.push('/');
				}}>
					<div className="icon_home_gray"></div>
					<div className="text">美食</div>
				</div>
				<div className={'item flex-g-1 flex-col-center' + (pathname === '/goods' ? ' active' : '')} onClick={() => {
					hashHistory.push('/goods');
				}}>
					<div className="icon_form_gray"></div>
					<div className="text">精选</div>
				</div>
				{ flag && (
					<div className={'item flex-g-1 flex-col-center' + (pathname === '/me' ? ' active' : '')} onClick={() => {
						hashHistory.push('/me');}}>
						<div className="icon_my_gray"></div>
						<div className="text">我的</div>
					</div>
				) }
				{ !flag && (
					<div className={'item flex-g-1 flex-col-center' + (pathname === '/login' ? ' active' : '')} onClick={() => {
						hashHistory.push('/login');}}>
						<div className="icon_my_gray"></div>
						<div className="text">我的</div>
					</div>
				) }

			</div>
		);
	}
}
export default Footer;
