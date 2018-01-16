import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { hashHistory } from 'react-router';
import CSSModules from 'react-css-modules';//是导入样式是使用的

export default class extends Component {
	render() {
		const { hashHistory, path = '/', children } = this.props;

		return (
			<div>
				<NavBar style={{borderBottom:'1px solid #999999', height:'90px'}}
					mode="light"
					icon={<Icon size="md" type="left" style={{color:'#333333'}}/>}
					onLeftClick={() => hashHistory.push(path)}
				>{children || '订单'}</NavBar>
			</div>
		);
	}
}
