import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import {  } from 'react-router';

export default class extends Component {
	render() {
		const { history, path = '/', children } = this.props;
		return (
			<div>
				<NavBar
					mode="light"
					icon={<Icon size="md" type="left"  style={{color:'#a3a3a3'}}/>}
					onLeftClick={() => history.push(path)}
					rightContent={this.props.rightContent || null}
				>{children || '详情'}</NavBar>
			</div>
		);
	}
}
