import React, { Component } from 'react';
import { NavBar, Icon, List, Stepper,InputItem } from 'antd-mobile';
import { Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import './style.scss';//是导入样式是使用的--

@createForm()
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			val: 1,
			status: false,
			isReq:false
		};
	}
	//
	changeNumber = (value,min,max) => {
		this.setState({ val: value });
		value ? value : 0;
		if ((value >= min) && (value <= max)) {
			this.props.change(value);
		}else{
			Toast.info('请输入合法的数据',2);
		}
	}
	// 减
	reduce = (val,min) => {
		if(this.state.isReq)return false;
		this.setState({
			isReq:true
		});
		if(min < val ){
			let cur = Number(val) - 1;
			this.setState({
				val: cur
			});
			this.props.change(cur);
		}
		setTimeout(() => {
			this.setState({
				isReq:false
			});
		},500);
	}
	// 加
	plus = (val,max) => {
		if(this.state.isReq)return false;
		this.setState({
			isReq:true
		});
		if(max > val){
			let cur = Number(val) + 1;
			this.setState({
				val: cur
			});
			this.props.change(cur);
		}
		setTimeout(() => {
			this.setState({
				isReq:false
			});
		},500);
	}
	render() {
		const { min, max} = this.props;
		const { getFieldProps } = this.props.form;
		let { val } = this.state;
		return (
			<div className="flex step-box jc-between">
				<p>数量</p>
				<div className="stepper-box flex ">
					<div className={ val <= min ? 'pro':'' } onClick={ () => { this.reduce(val,min); } }>-</div>
					<InputItem className="number"
						{...getFieldProps('number')}
						value={val}
						onChange={ (value) => { this.changeNumber(value,min,max); } }
						type="number"
						moneyKeyboardAlign="left"
					></InputItem>
					<div className={ val >= max ? 'pro':'' } onClick={ () => {this.plus(val,max);} }>+</div>
				</div>
			</div>
		);
	}
}
