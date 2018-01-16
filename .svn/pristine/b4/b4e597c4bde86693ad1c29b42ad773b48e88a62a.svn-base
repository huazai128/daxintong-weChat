import React, { Component } from 'react';
import { NavBar, Icon, List, Switch } from 'antd-mobile';
import { createForm } from 'rc-form';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import styles from './style.scss';//是导入样式是使用的--》这个需要使用对象的形式的去到

@createForm()
@CSSModules(styles)
export default class extends Component {
	render() {
		const { getFieldProps } = this.props.form;
		const { point,flag,info } = this.props;
		return (
			<List>
				<List.Item
					extra={<Switch
						color="#4794fe"
						{...getFieldProps('Switch1', {
							valuePropName: 'checked',
						}) }
						checked={flag}
						onClick={(checked) => {
							this.props.onChange(checked);
						}}
					/>}>
					<div styleName="text">{info}</div>
				</List.Item>
			</List >
		);
	}
}
