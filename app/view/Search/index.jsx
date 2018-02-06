import React, { Component } from 'react';
import { SearchBar, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import CSSModules from 'react-css-modules';
import { setStore, removeStore, getStore } from 'utils/store';
import { hashHistory } from 'react-router';
import { urlAPi } from 'service/api';
import { subViewHandle, SubViewLink } from 'app/components/subViewLink/subViewLink';
import { observer, inject } from 'mobx-react';

@inject(store => ({
	result: store.result,
	login: store.login
	}))
@observer
@CSSModules(require('./style.scss'))
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sreaches: []
		};
	}
	onCancel = () => {
		let { name='/' } = this.val(this, 'props.location.query');
		hashHistory.push(name);
	}
	val = (context, prop) => {
		let keys = prop.split('.'), cur= context;
		for(var i = 0;i < keys.length && cur !== undefined && cur !== null;i++){
			var key = keys[i];
			if(!cur.hasOwnProperty(key)){
				return undefined;
			}
			cur = cur[key];
		}
		return cur;
	}
	onSubmit = (val) => {
		if (val) {
			let sreaches = JSON.parse(getStore('history')) || [];
			let arr = [];
			if(sreaches.includes(val)){
				arr =	sreaches.filter((item) => item != val);
			}
			sreaches = arr.length ? arr : sreaches;
			if(sreaches.length >= 10){
				sreaches.pop(10);
			}
			sreaches.unshift(val);
			setStore('history', new Set([...sreaches]));
			subViewHandle.pushView('result', {
				title: '搜索结果',
				modelData: {
					keyword: val,
					result: this.props.result,
					login: this.props.login
				}
			});
		}
	}
	componentDidMount() {
		this.autoFocusInst.focus();
		let sreaches = JSON.parse(getStore('history'));
		this.setState({
			sreaches: sreaches
		});
	}
	componentDidUpdate(){
		this.autoFocusInst.focus();
	}
	componentWillReceiveProps() {
		let sreaches = JSON.parse(getStore('history'));
		this.setState({
			sreaches: sreaches
		});
	}
	clear = () => {
		removeStore('history');
		this.setState({
			sreaches:[]
		});
	}
	render() {
		const { sreaches } = this.state;
		return (
			<div>
				<div className="borderBottom">
					<SearchBar
						placeholder="搜索团购或商家"
						ref={ref => this.autoFocusInst = ref}
						onSubmit={this.onSubmit}
						onCancel={this.onCancel}
						onBlur={this.onSubmit}
					/>
				</div>
				<div className="hisLists">
					{sreaches && sreaches.length > 0 && sreaches.slice(0, 10).map((item, index) => {
						return (
							<div key={index}>
								<SubViewLink moduleName="result" title="搜索结果" modelData={{ keyword: item, result: this.props.result, login: this.props.login }}>{item}</SubViewLink>
							</div>
						);
					})}
				</div>
				{sreaches && sreaches.length > 0 && (<div className="remove-history" onClick={this.clear}>清除搜索记录</div>)}
			</div>
		);
	}
}
