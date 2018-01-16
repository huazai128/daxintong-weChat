import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import './index.scss';
import { hashHistory } from 'react-router';

export default class extends Component {
	render() {
		const { history, path = '/', children } = this.props;
		return (
			<div>
				<NavBar
					icon={<Icon size="md" type="left" style={{color:'#fff'}}/>}
					onLeftClick={() => hashHistory.push(path)}
				>{children || '订单'}</NavBar>
			</div>
		);
	}
}
