import React from 'react';
if (!window.SubViewRoutes) {
	let routes = {
		information(cb) {
			require.ensure([], (require) => {
				let Module = require('view/Information/information').default;
				cb(Module);
			}, 'information');
		},
		cateDetail(cb){
			require.ensure([], (require) => {
				let Module = require('view/CateDetail/').default;
				cb(Module);
			}, 'cate');
		},
		register(cb){
			require.ensure([], (require) => {
				let Module = require('view/RegPage/register').default;
				cb(Module);
			}, 'register');
		},
		order(cb){
			require.ensure([], (require) => {
				let Module = require('view/Order/').default;
				cb(Module);
			}, 'order');
		},
		commnents(cb){
			require.ensure([], (require) => {
				let Module = require('view/CommentList/').default;
				cb(Module);
			}, 'commnents');
		},
		graphic(cb){
			require.ensure([], (require) => {
				let Module = require('view/GraphicImg/graphic').default;
				cb(Module);
			}, 'graphic');
		},
		business(cb){
			require.ensure([], (require) => {
				let Module = require('view/Business/').default;
				cb(Module);
			}, 'business');
		},
		pay(cb){
			require.ensure([], (require) => {
				let Module = require('view/Pay/').default;
				cb(Module);
			}, 'pay');
		},
		payment(cb){
			require.ensure([], (require) => {
				let Module = require('view/Payment/').default;
				cb(Module);
			}, 'payment');
		},
		binding(cb){
			require.ensure([], (require) => {
				let Module = require('view/Binding/').default;
				cb(Module);
			}, 'binding');
		},
		collect(cb){
			require.ensure([], (require) => {
				let Module = require('view/Collect/').default;
				cb(Module);
			}, 'collect');
		},
		comments(cb){
			require.ensure([], (require) => {
				let Module = require('view/MyComments/comments').default;
				cb(Module);
			}, 'comments');
		},
		dxcard(cb){
			require.ensure([], (require) => {
				let Module = require('view/DaXinCard/card').default;
				cb(Module);
			}, 'dxcard');
		},
		coupon(cb){
			require.ensure([], (require) => {
				let Module = require('view/Coupon').default;
				cb(Module);
			}, 'coupon');
		},
		orderDetail(cb){
			require.ensure([], (require) => {
				let Module = require('view/OrderDetail/detail').default;
				cb(Module);
			}, 'orderDetail');
		},
		refund(cb){
			require.ensure([], (require) => {
				let Module = require('view/Refund/refund').default;
				cb(Module);
			}, 'refund');
		},
		teamBuy(cb){
			require.ensure([], (require) => {
				let Module = require('view/TeamBuy/').default;
				cb(Module);
			}, 'teamBuy');
		},
		codeDetail(cb){
			require.ensure([], (require) => {
				let Module = require('view/CodeDetail/code').default;
				cb(Module);
			}, 'codeDetail');
		},
		evaluate(cb){
			require.ensure([], (require) => {
				let Module = require('view/Evaluate/evaluate').default;
				cb(Module);
			}, 'evaluate');
		},
		result(cb){
			require.ensure([], (require) => {
				let Module = require('view/searchResult/result').default;
				cb(Module);
			}, 'result');
		},
		mobile(cb){
			require.ensure([], (require) => {
				let Module = require('view/PhoneBind/').default;
				cb(Module);
			}, 'mobile');
		},
		password(cb){
			require.ensure([], (require) => {
				let Module = require('view/Password/').default;
				cb(Module);
			}, 'password');
		},
		forget(cb){
			require.ensure([], (require) => {
				let Module = require('view/ForgetPassword/forget').default;
				cb(Module);
			}, 'forget');
		},
		payed(cb){
			require.ensure([], (require) => {
				let Module = require('view/Payed/payed').default;
				cb(Module);
			}, 'payed');
		},
		payLogin(cb){
			require.ensure([], (require) => {
				let Module = require('view/PayLogin/login').default;
				cb(Module);
			}, 'payLogin');
		},
		wxLogin(cb){
			require.ensure([], (require) => {
				let Module = require('view/wxLogin/wx').default;
				cb(Module);
			}, 'wxLogin');
		},
		dxDetail(cb){
			require.ensure([], (require) => {
				let Module = require('view/dxDetail/detail').default;
				cb(Module);
			}, 'dxDetail');
		},
	};
	window.SubViewRoutes = routes;
}
let SubViewRoutes = window.SubViewRoutes;
export { SubViewRoutes };
