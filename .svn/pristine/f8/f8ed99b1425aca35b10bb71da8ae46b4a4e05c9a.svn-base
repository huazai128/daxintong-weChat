import api from 'utils';
export const urlAPi = {
	// 获取短信
	sendTest: (data) => {
		const params = Object.assign({
			ctl:'sms',
			act:'send_sms_code'
		},data);
		return api('',params);
	},
	// 获取团购详情
	getCateDetail:(data) => {
		const params = Object.assign({
			ctl:'deal',
			act:'index'
		},data);
		return api('',params);
	},
	// 注册
	register:(data) => {
		const query = {
			ctl:'user',
			act:'doregister'
		};
		return api('',data,'POST',query);
	},
	// 图文详情
	graphic:(data) => {
		const params = Object.assign({
			ctl:'deal',
			act:'detail'
		},data);
		return api('',params);
	},
	// 团购收藏
	getShare:(data) => {
		const params = Object.assign({
			ctl:'deal',
			act:'add_collect'
		},data);
		return api('',params);
	},
	// 商品详情
	getBusiniss:(data) => {
		const params = Object.assign({
			ctl:'store',
			act:'index'
		},data);
		return api('',params);
	},
	// 收藏商家
	collectionBusiniss:(data) => {
		const params = Object.assign({
			ctl:'store',
			act:'add_collect'
		},data);
		return api('',params);
	},
	// 评论列表
	commentLists:(data) => {
		const params = Object.assign({
			ctl:'dp',
			act:'index'
		},data);
		return api('',params);
	},
	// 未登录提交订单页面
	submitOrder:(data) => {
		const params = Object.assign({
			ctl:'cart',
			act:'index'
		},data);
		return api('',params);
	},
	// 已登录提交订单页面
	submitOnOrder:(data) => {
		const params = Object.assign({
			ctl:'cart',
			act:'check'
		},data);
		return api('',params);
	},
	// 计算金额
	countOrder:(data) => {
		const params = Object.assign({
			ctl:'cart',
			act:'count_buy_total'
		},data);
		return api('',params);
	},
	// 提交表单
	addOrder:(data) => {
		const params = Object.assign({
			ctl:'cart',
			act:'done'
		},data);
		return api('',params);
	},
	// 订单提交支付生产支付订单号
	payOrder:(data) => {
		const params = Object.assign({
			ctl:'cart',
			act:'order'
		},data);
		return api('',params);
	},
	// 支付方式
	payStyle:(data) => {
		const params = Object.assign({
			ctl:'cart',
			act:'order_done'
		},data);
		return api('',params);
	},
	// 大信通卡确认支付==================
	btnPay: (data) => {
		const params = Object.assign({
			ctl:'payment',
			act:'dxtgpayment'
		},data);
		return api('',params);
	},
	//  订单列表
	pay_status:(data) => {
		const params = Object.assign({
			ctl:'uc_order',
			act:'index'
		},data);
		return api('',params);
	},
	// 订单详情
	orderDetail:(data) => {
		const params = Object.assign({
			ctl:'uc_order',
			act:'details'
		},data);
		return api('',params);
	},
	// 团购券详情
	couponDetail:(data) => {
		const params = Object.assign({
			ctl:'uc_order',
			act:'counpon_info'
		},data);
		return api('',params);
	},
	// 取消订单
	cancelPay:(data)=>{
		const params = Object.assign({
			ctl:'uc_order',
			act:'cancel'
		},data);
		return api('',params);
	},
	// 查看券码
	lookCode:(data) => {
		const params = Object.assign({
			ctl:'uc_order',
			act:'select_coupon'
		},data);
		return api('',params);
	},
	// 评论
	addEvaluate:(data) => {
		const params = Object.assign({
			ctl:'dp',
			act:'add_dp'
		});
		return api('',data,'POST',params);
	},
	// 商家收藏
	shopLists:(data) => {
		const params = Object.assign({
			ctl:'uc_collect',
			act:'store_collect'
		},data);
		return api('',params);
	},
	// 团购收藏
	tuanLists:(data) => {
		const params = Object.assign({
			ctl:'uc_collect',
			act:'index'
		},data);
		return api('',params);
	},
	// 我的点评
	myComments:(data) => {
		const params = Object.assign({
			ctl:'uc_review',
			act:'index'
		},data);
		return api('',params);
	},
	// 大信通卡信息
	dxCard:(data) => {
		const params = Object.assign({
			ctl:'user_center',
			act:'cardinfo'
		},data);
		return api('',params);
	},
	// 大信通卡解绑
	unDxCode:(data) => {
		const params = Object.assign({
			ctl:'user_center',
			act:'unbundlingcard'
		},data);
		return api('',params);
	},
	// 团购券
	couponLists:(data) => {
		const params = Object.assign({
			ctl:'uc_coupon',
			act:'index'
		},data);
		return api('',params);
	},
	// 大信通卡绑定
	bindCard:(data) => {
		const query = {
			ctl:'user_center',
			act:'bindingcard'
		};
		return api('',data,'POST',query);
	},
	// 搜索接口
	search:(data) => {
		const params = Object.assign({
			ctl:'stores',
			act:'index'
		},data);
		return api('',params);
	},
	// 退款详情
	getOrderDetail:(data) => {
		const params = Object.assign({
			ctl:'uc_order',
			act:'refund_coupon'
		},data);
		return api('',params);
	},
	// 退款金额
	refundMoney:(data) => {
		const params = Object.assign({
			ctl:'uc_order',
			act:'refund_money_count'
		},data);
		return api('',params);
	},
	// 执行退款
	refundSure:(data) => {
		const query = {
			ctl:'uc_order',
			act:'do_refund_coupon'
		};
		return api('',data,'POST',query);
	},
	// 修改用户名
	reviseUsername:(data) => {
		const params = Object.assign({
			ctl:'user',
			act:'upusername'
		},data);
		return api('',params);
	},
	// 修改邮箱
	reviseEmail:(data) => {
		const params = Object.assign({
			ctl:'user',
			act:'upemail'
		},data);
		return api('',params);
	},
	// 更新手机号
	resetMobel:(data) => {
		const query = {
			ctl:'user',
			act:'dophbind'
		};
		return api('',data,'POST',query);
	},
	// 修改密码
	revisePassword:(data) => {
		const query = {
			ctl:'user_center',
			act:'modify_password'
		};
		return api('',data,'POST',query);
	},
	// 获取微信登录情况
	getWeixinstatus:(data) => {
		const params = Object.assign({
			ctl:'synclogin',
			act:'wx'
		},data);
		return api('',params);
	},
	// 获取微信登录用户信息
	// getWeixininfo:(data) => {
	// 	const params = Object.assign({
	// 		ctl:'synclogin',
	// 		act:'oauth'
	// 	},data);
	// 	return api('',params);
	// },
	// 完善手机
	getWeixinMobile:(data) => {
		const params = Object.assign({
			ctl:'synclogin',
			act:'mobile_auth'
		},data);
		return api('',params);
	},
	// 上次头像
	upload:(data) => {
		const query = {
			ctl:'uc_account',
			act:'upload_avatar'
		};
		return api('',data,'POST',query);
	},
	// 手机快捷登录
	getLoginMobile:(data) => {
		const params = Object.assign({
			ctl:'user',
			act:'dophlogin'
		},data);
		return api('',params);
	},
	// 账号登录
	getLoginAccount:(data) => {
		const query = {
			ctl:'user',
			act:'dologin'
		};
		return api('',data,'POST',query);
	},
	// 获取sess_id
	getSess:(data) => {
		const params = Object.assign({
			ctl:'init',
			act:'index'
		},data);
		return api('',params);
	},
	// 获取用户信息
	getUserInof:(data) => {
		const params = Object.assign({
			ctl:'user_center',
			act:'index'
		},data);
		return api('',params);
	},
	// 个人资料
	getInformation:(data) => {
		const params = Object.assign({
			ctl:'user_center',
			act:'user_info'
		},data);
		return api('',params);
	},
	// 退出
	getQuit:(data) => {
		const params = Object.assign({
			ctl:'user',
			act:'loginout'
		},data);
		return api('',params);
	},
	// 分享
	share:(data) => {
		const params = Object.assign({
			ctl:'share',
			act:'index'
		},data);
		return api('',params);
	},
	// 修改密码
	forget:(data) => {
		const query = {
			ctl:'user',
			act:'phmodifypassword'
		};
		return api('',data,'POST',query);
	},
	// 微信解绑
	unBindWx:(data) => {
		const params = Object.assign({
			ctl:'syncrelieve',
			act:'wx'
		},data);
		return api('',params);
	},
	// 微信绑定
	bindWx:(data) => {
		const params = Object.assign({
			ctl:'syncbind',
			act:'wx'
		},data);
		return api('',params);
	},
	// 微信登录完善手机号码
	wxLogin:(data) => {
		const params = Object.assign({
			ctl:'synclogin',
			act:'mobile_auth'
		},data);
		return api('',params);
	},
	// 获取微信信息
	wxInfo:() => {
		const params = Object.assign({
			ctl:'synclogin',
			act:'wx_user_info'
		},{});
		return api('',params);
	},
};
