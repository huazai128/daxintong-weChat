import React, { Component } from 'react';
import Nav from 'components/Navtwo';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import styles from './payed.scss';//是导入样式是使用的--
import { urlAPi } from 'service/api';
import { hashHistory } from 'react-router';
import { SubViewLink, subViewHandle } from 'app/components/subViewLink/subViewLink';
import { setStore,getStore,removeStore } from 'utils/store';
import { observer, inject } from 'mobx-react';
import QRCode from 'qrcode.react';
import { Toast } from 'antd-mobile';

@observer
@CSSModules(styles)
class Payed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total_price: 0,
			isShow:false
		};
	}
	componentDidMount() {
		this.getOrderDetail();
	}
	getOrderDetail = async () => {
		const id = this.props.modelData.id;
		const res = await urlAPi.payOrder({ order_id: id });
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			const {  pay_status } = res.result;
			setStore('payStatus',pay_status);
			Toast.loading('加载中...',3);
			this.setState({
				result:res.result,
				pay_status: pay_status,
				couponlist:res.result.couponlist
			});
		}
	}
	componentWillUnmount(){
		Toast.hide();
		setStore('home',true);
		const { isGoHome,tui } = this.props.modelData;
		if(isGoHome || tui){
			hashHistory.push('/');
		}
	}
	render() {
		const { result,pay_status,couponlist} = this.state;
		return (
			<div className="payed ">
				<div className="flex-col" style={{ height: '100%' }}>
					{/* <Nav >订单完成</Nav> */}
					<div className="flex-g-1 scroll-absolute">
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
											<div >
												<QRCode value={ `${ result.qrcode_pwd }` }  size={ 250 } />
											</div>
											<p>验证码： <span>{item.password}</span></p>
										</div>
									);
								})}
							</div>
						</div>
					</div>
					<div styleName="suc-btn" className="flex" >
						<div onClick={() => {
							hashHistory.push('/goods');
						}}>继续购物</div>
						<div><SubViewLink moduleName="coupon" title="团购券">查看团购券</SubViewLink></div>
					</div>
				</div>
			</div>
		);
	}
}

export default Payed;
