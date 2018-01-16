import React, { Component } from 'react';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import styles from './code.scss';//是导入样式是使用的--
import { urlAPi } from 'service/api';
import { hashHistory } from 'react-router';
import { SubViewLink, subViewHandle } from 'app/components/subViewLink/subViewLink';
import { setStore,getStore,removeStore } from 'utils/store';
import QRCode from 'qrcode.react';
import Clipboard from 'react-clipboard.js';
import { Toast } from 'antd-mobile';

@CSSModules(styles)
class Payed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total_price: 0,
		};
		this.store = this.props.home;
	}
	componentDidMount() {
		this.getOrderDetail();
	}
	getOrderDetail = async () => {
		const { id } = this.props.modelData;
		const res = await urlAPi.payOrder({ order_id: id });
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			const {  pay_status, } = res.result;
			this.setState({
				result:res.result,
				pay_status: pay_status,
				couponlist:res.result.couponlist
			});
		}
	}
	componentWillUnmount(){
	}
	onSuccess = () => {
		Toast.info('复制成功',2);
	}
	render() {
		const { result,pay_status,couponlist} = this.state;
		return (
			<div>
				<div styleName="suc-detail" className="flex">
					<div styleName="suc-img"><img src={ result && result.icon} /></div>
					<div className="flex-g-1">
						<h4>{ result && result.deal_name}</h4>
						<p>订单编号：{result && result.order_sn}</p>
					</div>
				</div>
				<div styleName="quan-items">
					{ couponlist && couponlist.map((item, index) => {
						return (
							<div styleName="item" key={index}>
								{/* <h4>{item.password}</h4> */}
								<div >
									<QRCode value={ `${ item.qrcode_pwd }` } size={ 250 } />
								</div>
								<p>验证码：
									<Clipboard className="copy-btn" data-clipboard-text={item.password} onSuccess={this.onSuccess}>
										<span>{item.password}</span>
									</Clipboard>
								</p>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default Payed;
