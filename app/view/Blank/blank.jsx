import React,{ Component } from 'react';
import { setStore,getStore,removeStore } from 'utils/store';
import { SubViewLink, subViewHandle } from 'app/components/subViewLink/subViewLink';
import { hashHistory } from 'react-router';
import { urlAPi } from 'service/api';
import { Toast } from 'antd-mobile';
import './blank.scss';

export default class  extends Component {
	constructor(props){
		super(props);
	}
	componentDidMount() {
		Toast.loading('加载中...',10);
		this.getOrderDetail();
	}
	getOrderDetail = async () => {
		const { id } = this.props.params;
		if (JSON.parse(getStore('isStatus'))) {
			removeStore('isStatus');
			hashHistory.push('/');
			return false;
		}
		const res = await urlAPi.payOrder({ order_id: id });
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			const {  pay_status } = res.result;
			Toast.loading('加载中...',3);
			if (Object.is(pay_status, 0)) {
				setStore('isStatus',true);
				subViewHandle.pushView('pay', {
					title: '支付订单',
					modelData: {
						order_id: id,
						tui:true
					}
				});
				return false;
			}else if(Object.is(pay_status, 1)){
				setStore('isStatus',true);
				subViewHandle.pushView('payed', {
					title: '订单完成',
					modelData: {
						id: id,
						tui:true
					}
				});
			}
		}
	}
	componentWillUnmount(){
		Toast.hide();
		hashHistory.push('/');
	}
	render() {
		return (
			<div className="blank-box">
			</div>
		);
	}
}
