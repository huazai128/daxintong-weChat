import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Carousel, WhiteSpace, WingBlank, NavBar, Icon, Toast } from 'antd-mobile';
import CSSModules from 'react-css-modules';//是导入样式是使用的
import styles from './teambuy.scss';//是导入样式是使用的--
import { urlAPi } from 'service/api';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';
import { hashHistory }  from 'react-router';
import ConfirmHtml from 'components/ConfirmHtml/';
import ConfirmButton from 'components/ConfirmButton/';
import QRCode from 'qrcode.react';
import { getStore } from 'utils/store';
import { meter } from 'utils/meter';

let loc = JSON.parse(getStore('location'));
@CSSModules(styles)
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			result: {}
		};
	}
	componentDidMount() {
		this.getCouponDetail();
	}
	getCouponDetail = async () => {
		const { id } = this.props.modelData;
		const params = {
			m_longitude: loc ? loc.longitude:'',
			m_latitude: loc ? loc.latitude :'',
			id: id
		};
		const res = await urlAPi.couponDetail(params);
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			this.setState({
				result: res.result.item
			});
		}
	}
	onPhone = () => {
		Toast.info('无电话号码',2);
	}
	render() {
		const { result } = this.state;
		return (
			<div styleName="team-bg">
				{/* <Nav path="/">团购券详情</Nav> */}
				<div styleName="payment-box">
					<SubViewLink moduleName="cateDetail" title="团购详情" modelData={{ id: result.deal_id }} confirmButtonHtml={<ConfirmButton id={result.deal_id} isCollect={result.is_collect} />} confirmButtonHtml={<ConfirmButton onChange={(value) => { result.is_collect = value; }} id={result.deal_id} item={result} isCollect={result.is_collect} />}>
						<div styleName="shop-detail" className="flex">
							<div styleName="shop-img"><img src={result.dealIcon} /></div>
							<div className="flex-g-1 ml20">
								<h4 >{result.name}</h4>
								<div className="flex wraptags-box mt10" >
									{ result.deal_tags && result.deal_tags.map((item,index) => {
										return (
											<div className="mr15" key={index} styleName="shop-type">{item}</div>
										);
									}) }
								</div>
							</div>
						</div>
					</SubViewLink>
					{/* 二维码 */}
					<div styleName="erwei">
						<div className="flex-center">
							<div styleName='erweione'>
								<p styleName='sao'>扫二维码</p>
								<div styleName='imgone' >
									<QRCode value={ `${ result.qrcode_pwd }` }  size={ 250 } />
								</div>
								<p styleName='yanone'>或使用验证码</p>
								<p styleName='number'>{result.password}</p>
							</div>
						</div>
					</div>
					{/* 商家信息 */}
					<div styleName="shangjia">商家信息</div>
					{/* 海归 */}
					<div className="flex" styleName='haigui'>
						<div styleName="lefthai" className="flex-g-1">
							<h3 styleName='haitop'>{result.spName || '暂无名称'}</h3>
							<p styleName='address'>{result.spAddress || '暂无地址'}</p>
							<div styleName='dingweifont'>{ meter(result.distance) }</div>
						</div>
						{ result.spTel && (<div styleName="rightphone"><a href={`tel: ${result.spTel}`}></a></div>) }
						{ !result.spTel && (<div styleName="rightphone" onClick={ this.onPhone }></div>) }
					</div>
					<div styleName="bg"></div>
					<div styleName='messagetop'>
						<p styleName='messageorder'>订单信息</p>
						<div className="t-icon icon-one">订单编号：{result.order_sn}</div>
						<div className="t-icon icon-two">使用期限：{result.end_time}</div>
						<div className="t-icon icon-three">数量：{result.number}</div>
						<div className="t-icon icon-fore">总价：￥{Number(result.number * result.unit_price)}</div>
					</div>
				</div>
			</div>
		);
	}
}
