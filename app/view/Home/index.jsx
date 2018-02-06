import React, { Component } from 'react';
import styles from './style.scss';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';
import Footer from 'components/Footer/footer';
import { setStore, removeStore, getStore } from 'utils/store';
import { urlAPi } from 'service/api';
import { observer, inject } from 'mobx-react';
import { hashHistory } from 'react-router';
import { Toast } from 'antd-mobile';
let wx = window.wx;
function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return (r[2]); return null;
}

@inject('home')
@observer
class TabBarExample extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isShow: false
		};
		this.store = this.props.home;
	}
	componentDidMount() {
		let query = this.props.location.query;
		let page = getQueryString('page');
		let id = getQueryString('id');
		if (page && id) {
			let url = window.location.href.split('?')[0];
			window.location.href = `${url}#/${page}/${id}`;
			return false;
		}else{
			setTimeout(() => {
				this.setState({
					isShow: true
				});
			}, 100);
		}
		setInterval(() => {
			this.newWork();
		},5000);
	}
	componentWillReceiveProps(){
		setInterval(() => {
			this.newWork();
		},5000);
	}
	newWork = () => {
		wx.ready(() => {
			wx.getNetworkType({
				success:  (res) => {
					let networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
					if (Object.is(networkType, 'none')) {
						Toast.info('暂无网络', 2);
					}
				}
			});
		});
	}
	render() {
		let pathname = [];
		this.props.routes.forEach(item => {
			if (item.path) {
				pathname.push(item.path.split('/')[1]);
			}
		});
		pathname = pathname.join('/');
		const { isShow } = this.state;
		return (
			<div className="flex-col" style={{ height: '100%', width: '100%' }}>
				{isShow && (
					<div className="flex-col" id="main">
						<div className="flex-g-1 content">
							{this.props.children}
						</div>
						{this.store.isFooter && <Footer pathname={pathname} ref="footer" />}
					</div>
				)}
			</div>
		);
	}
}
export default TabBarExample;

