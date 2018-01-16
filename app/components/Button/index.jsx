import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Carousel, WhiteSpace, WingBlank, NavBar, Icon, Button } from 'antd-mobile';

export default class extends Component {
	render() {
		return (
			<Button type="primary" style={{margin:'120px 60px', fontSize:'30px'}}>提交订单</Button>
		)
	}
}
