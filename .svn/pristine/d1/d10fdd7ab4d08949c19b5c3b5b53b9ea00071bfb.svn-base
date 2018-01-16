import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './card.scss';
import { urlAPi } from 'service/api';
import { hashHistory } from 'react-router';
import { Toast} from 'antd-mobile';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';

@CSSModules(styles)
class Card extends Component{
	constructor(props){
		super(props);
		this.state = {
			isShow:false,
			cardInfo:{}
		};
	}
	componentDidMount(){
		this.getCardInfo();
	}
	getCardInfo = async() => {
		Toast.loading('加载中...',30);
		const res = await urlAPi.dxCard({});
		if(Object.is(res.code,0) && Object.is(res.message,'ok')){
			this.setState({
				cardInfo: res.result
			});
		}
		Toast.hide();
	}
	onBind =  () => {
		this.setState({
			isShow:true
		});
	}
	// 确认解绑
	sure = async() => {
		const res = await urlAPi.unDxCode({});
		this.setState({
			isShow:false
		});
		if(Object.is(res.code,0) ){
			Toast.info('解绑成功',2);
			hashHistory.push('/me');
		}else{
			Toast.info('解绑失败',2);
		}
	}
	// 取消
	cancel = () => {
		this.setState({
			isShow:false
		});
	}
	render(){
		const { isShow,cardInfo } = this.state;
		return(
			<div>
				<div styleName="card-bg">
					<h4 onClick={ this.onBind }>解绑</h4>
				</div>
				<div styleName="card-box">
					<div styleName="card">
						<p>{cardInfo.dxtg_card }</p>
					</div>
					<div styleName="card-money" className="flex">
						<div className="flex-col-6">余额：￥{ cardInfo.balance }</div>
						<div className="flex flex-center flex-col-6">
							<SubViewLink  moduleName="dxDetail" title="积分使用说明">
								<div className="flex">
									<div>积分：{ cardInfo.dxtg_point }</div>
									<div styleName="card-ques"></div>
								</div>
							</SubViewLink>
						</div>
					</div>
				</div>
				{ isShow && (
					<div>
						<div styleName="yin"></div>
						<div styleName="tan-box" className="flex-center">
							<div styleName="tan-content">
								<div styleName="tan-detail">
									<p>确定解绑此卡吗？</p>
									<p>解绑后无法使用此卡支付。</p>
								</div>
								<div styleName="tab-btn" className="flex">
									<button className="flex-col-6" onClick={ this.sure }>确认</button>
									<button className="flex-col-6" onClick={ this.cancel }>取消</button>
								</div>
							</div>
						</div>
					</div>
				) }

			</div>
		);
	}
}

export default Card;
