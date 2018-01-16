import React, { Component } from 'react';
import styles from './style.scss';
import { Icon, Picker, List } from 'antd-mobile';

import { toJS } from 'mobx';

// 如果不是使用 List.Item 作为 children
const CustomChildren = props => {
	const { onClick, children, extra, label } = props;
	return (
		<div onClick={onClick}>
			{label || children}
			<Icon className={styles.icon} size="xxs" type="down" />
		</div>
	);
};

export default class extends Component {
	static defaultProps = {
		onOk: value => { },
		value: [],
		data: [],
	}
	render() {
		const { children, span, className, value, data } = this.props;
		const label = (toJS(value)[0] !== undefined && !!data.length) ? (data.find(item => item.value === value[0]).keyLabel || data.find(item => item.value === value[0]).label) : '';
		return (
			<div className={`${styles.picker} ${className} flex-col-${span} `}>
				<Picker
					data={[data]}
					cascade={false}
					value={value}
					onOk={this.props.onOk}
				>
					<CustomChildren label={label}>{children}</CustomChildren>
				</Picker>
			</div>
		);
	}
}
