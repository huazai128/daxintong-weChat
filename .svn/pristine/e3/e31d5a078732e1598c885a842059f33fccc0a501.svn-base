import React, { Component } from 'react';
import styles from './style.scss';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';
import Footer from 'components/Footer/footer';
import { setStore, removeStore, getStore } from 'utils/store';
import { urlAPi } from 'service/api';
import { observer, inject } from 'mobx-react';
let wx = window.wx;

@inject('home')
@observer
class TabBarExample extends React.Component {
	constructor(props) {
		super(props);
		this.store = this.props.home;
	}
	render() {
		let pathname = [];
		this.props.routes.forEach(item => {
			if (item.path) {
				pathname.push(item.path.split('/')[1]);
			}
		});
		pathname = pathname.join('/');
		return (
			<div className="flex-col" id="main">
				<div className="flex-g-1 content">
					{this.props.children}
				</div>
				{this.store.isFooter && <Footer pathname={pathname} ref="footer" />}
			</div>
		);
	}
}
export default TabBarExample;

