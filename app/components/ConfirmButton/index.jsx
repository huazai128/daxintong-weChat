import React, { Component } from 'react';
import './index.scss';
import { Toast } from 'antd-mobile';
import { urlAPi } from 'service/api';


class ConfirmButton extends Component {

	change = () => {
		const { id } = this.props;
		urlAPi.getShare({ id: id }).then((res) => {
			Toast.info(res.message, 2, null, false);
			if (Object.is(res.code, 0)) {
				let act = res.result.is_collect;
				this.props.item.is_collect = act;
				this.setState({});
				if (this.props.onChange) {
					this.props.onChange(act);
				}
			}
		});
	}
	render() {
		let active = Object.is(this.props.item.is_collect, 1) ? true : false;
		return (
			<div className={`cate-share ${active ? 'active' : ''}`} onClick={this.change}></div>
		);
	}
}

export default ConfirmButton;
