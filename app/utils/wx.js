
import {urlAPi}  from 'service/api';
import wx from 'weixin-js-sdk';
import { setStore } from 'utils/store';
if(!window.wx){
	window.wx = wx;
}
export const wxSdk = (url) => {
	urlAPi.share({ url: url }).then((res) => {
		if (Object.is(res.code, 0) && Object.is(res.message, 'ok')) {
			const { appId, timestamp, nonceStr, signature } = res.result;
			wx.config({
				debug: true,
				appId: appId,
				timestamp: timestamp,
				nonceStr: nonceStr,
				signature: signature,
				jsApiList: [ // 注册方法
					'checkJsApi',
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'onMenuShareQZone',
					'openLocation',
					'previewImage',
					'getLocation'
				]
			});
		}
		wx.ready(() => {
			wx.getLocation({
				type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success:  (res) => {
					setStore('location', res);
				},
				fail:(res) => {
				},
				complete: () =>{
					// Toast.hide();
					// ReactDOM.render(
					// 	<Provider {...stores}>
					// 		<RoutesConfig />
					// 	</Provider>,
					// 	document.getElementById('root')
					// );
				}
			});
		});
	});
};
