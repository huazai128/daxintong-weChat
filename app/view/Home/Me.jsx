import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { hashHistory } from 'react-router';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';
import { observer, inject } from 'mobx-react';
import { urlAPi } from 'service/api';
import { Toast } from 'antd-mobile';
import { getStore, removeStore } from 'utils/store';
const wx = window.wx;

@CSSModules(require('./me.scss'), { allowMultiple: true })
export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			avatar: '',
			userInfo: {}
		};
	}
	componentDidMount() {
		this.getAccountInfo();
	}
	componentWillReceiveProps() {
		this.getAccountInfo();
	}
	// 上次图片
	upload = async (e) => {
		// wx.ready(() => {
		// 	wx.chooseImage({
		// 		count: 1, // 默认9
		// 		sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		// 		sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		// 		success: (res) => {
		// 			var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
		// 			wx.getLocalImgData({
		// 				localId: localIds[0], // 图片的localID
		// 				success:  (res) => {
		// 					var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
		// 					alert(localData);
		// 					this.uploadImg(localData);
		// 				}
		// 			});
		// 		}
		// 	});
		// });
		Toast.info('上传图片中...',20);
		const file = e.target.files[0];
		const validExts = ['jpg','jpeg','svg','png','gif'];
		const ext = file.name.split('.')[1];
		if(validExts.includes(ext.toLowerCase())){
			const res = await urlAPi.upload({file:file});
			Toast.info(res.message, 3);
			if(Object.is(res.code,0)){
				this.getAccountInfo();
			}
		}else{
			Toast.info('请选择图片上传',2);
		}
		setTimeout(() => {
			Toast.hide();
		},3000);
	}
	// uploadImg = async (file) => {
	// 	Toast.info('上传图片中...',20);
	// 	const res = await urlAPi.upload({ file: file });
	// 	Toast.info(res.message, 3);
	// 	if (Object.is(res.code, 0)) {
	// 		this.getAccountInfo();
	// 	}
	// }
	// 绑定
	bindWx = async () => {
		const res = await urlAPi.bindWx({});
		Toast.info(res.message, 2);
	}
	// 获取用户信息
	getAccountInfo = async () => {
		const res = await urlAPi.getUserInof({});
		if (Object.is(res.code, 0)) {
			this.setState({
				userInfo: res.result
			});
			if (Object.is(res.result.wx_is_binding, 0)) {
				if (getStore('bindWx')) {
					removeStore('bindWx');
					this.bindWx();
				}
			}
		}
		if (Object.is(res.result.user_login_status, 0)) {
			removeStore('isLogin');
			removeStore('expired');
			hashHistory.push('/login');
		}
	}
	render() {
		const { avatar, userInfo } = this.state;
		return (
			<div className="flex-col">
				<div styleName="me-app" className="flex">
					<div styleName="me-logo" className="flex-g-1">
						<p>体验更多优惠</p>
						<p>快下载大信通手机APP</p>
					</div>
					<a styleName="app-upload" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.daxintong.tuan">下载APP</a>
				</div>
				<div className="flex-g-1 scroll-absolute">
					<div>
						<div styleName="me-detail">
							<div styleName="info" className="flex pt40 pb40" >
								<div styleName="avatar" className="mr35">
									<input type="file" onChange={this.upload} multiple={false} />
									{/* <div onClick={this.upload}></div> */}
									<img src={userInfo.user_avatar} />
								</div>
								<div className="flex-g-1">
									<SubViewLink moduleName="information" title="个人资料" modelData={{ id: userInfo.uid, store: this.store }}>
										<div className="flex">
											<div className="flex-g-1">
												<p>{userInfo.user_name}</p>
												<p>个人中心</p>
											</div>
											<div styleName="detail">></div>
										</div>
									</SubViewLink>
								</div>
							</div>
						</div>
						<div styleName="order" className="mb30">
							<div>
								<SubViewLink moduleName="payment" title="我的订单" modelData={{ id: userInfo.uide, page: 0 }}>
									<div styleName="order-head" className="flex jc-between" >
										<h4>我的订单</h4>
										<div className="flex-g-1">查看全部订单</div>
									</div>
								</SubViewLink>
							</div>
							<div className="flex icon-group">
								<div className="flex-g-1">
									<SubViewLink moduleName="payment" title="我的订单" modelData={{ id: userInfo.uid, page: 1 }}>
										<div className="me-icon pay">
											{userInfo.not_pay_order_count && <p>{userInfo.not_pay_order_count}</p>} 待付款
										</div>
									</SubViewLink>
								</div>
								<div className="flex-g-1">
									<SubViewLink moduleName="payment" title="我的订单" modelData={{ id: userInfo.uid, page: 2 }}>
										<div className="me-icon user" >
											{userInfo.not_spending_count && <p>{userInfo.not_spending_count}</p>}
											待使用
										</div>
									</SubViewLink>
								</div>
								<div className="flex-g-1">
									<SubViewLink moduleName="payment" title="我的订单" modelData={{ id: userInfo.uid, page: 3 }}>
										<div className=" me-icon comment">
											{userInfo.wait_dp_count && <p>{userInfo.wait_dp_count}</p>} 待评价
										</div>
									</SubViewLink>
								</div>
								<div className="flex-g-1">
									<SubViewLink moduleName="payment" title="我的订单" modelData={{ id: userInfo.uid, page: 4 }}>
										<div className=" me-icon refund">
											{userInfo.refunding_count && <p>{userInfo.refunding_count}</p>} 退款/售后
										</div>
									</SubViewLink>
								</div>
							</div>
						</div>
						<div className="flex wrap" styleName="me-box">
							<div className="flex-col-4 ">
								<SubViewLink moduleName="collect" title="我的收藏" modelData={{ id: userInfo.uide, page: 4 }}>
									<div className="me-btn collect">我的收藏</div>
								</SubViewLink>
							</div>
							<div className="flex-col-4 ">
								<SubViewLink moduleName="comments" title="我的点评" modelData={{ id: userInfo.uide, page: 4 }}>
									<div className="me-btn mycom">我的点评</div>
								</SubViewLink>
							</div>
							{ Object.is(userInfo.open_dxt_card,1) && (
								<div className="flex-col-4 ">
									{Object.is(userInfo.daxt_status, 1) && (
										<SubViewLink moduleName="dxcard" title="大信通卡">
											<div className="me-btn daxin">大信通卡</div>
										</SubViewLink>
									)}
									{Object.is(userInfo.daxt_status, 0) && (
										<SubViewLink moduleName="binding" title="大信通卡">
											<div className="me-btn daxin">大信通卡</div>
										</SubViewLink>
									)}
								</div>
							) }
							<div className="flex-col-4 " >
								<SubViewLink moduleName="coupon" title="团购券" >
									<div className="me-btn tuan">团购券</div>
								</SubViewLink>
							</div>
						</div>
					</div>
				</div>

			</div>
		);
	}
}
