/**
 *
 * @create by 2017-11-25
 * @param {any} params
 * @returns
 */

import { getStore } from 'utils/store';

const serializeParams = (params) => {
	return Object.entries(params).map((n, i) => {
		return `${n[0]}=${n[1]}`;
	}).join('&');
};
// export let API_HOST = process.env.NODE_ENV == 'production' ? 'https://testtuan.daxinmall.com/wxtest/wx/index.php' : 'http://tuan.dpass.cn:29080/dxtgv3/wx/index.php';
export let API_HOST = process.env.NODE_ENV == 'production' ? 'https://testtuan.daxinmall.com/uatwx/wx/index.php' : 'http://tuan.dpass.cn:29080/dxtgv3/wx/index.php';
// export let API_HOST = process.env.NODE_ENV !== 'production' ? 'https://tuan.daxinmall.com/wx/index.php' : 'https://tuan.dpass.cn:29080/dxtgv3/wx/index.php';
export const API_ROOT = API_HOST;
// export const codeImg = process.env.NODE_ENV == 'production' ? 'https://testtuan.daxinmall.com/wxtest/wx/verify.php' : 'http://tuan.dpass.cn:29080/dxtgv3/wx/verify.php';
export const codeImg = process.env.NODE_ENV == 'production' ? 'https://testtuan.daxinmall.com/uatwx/wx/verify.php' : 'http://tuan.dpass.cn:29080/dxtgv3/wx/verify.php';
// export const codeImg = process.env.NODE_ENV !== 'production' ? 'https://tuan.daxinmall.com/wx/verify.php' : 'http://tuan.dpass.cn:29080/dxtgv3/wx/verify.php';

export default async (url = '', data = {}, type = 'GET', query = {}, method = 'fetch') => {
	type = type.toUpperCase();
	url = API_ROOT + url;
	let sess_id = getStore('sess_id');
	if(sess_id){
		data.sess_id = sess_id;
	}
	if(Object.is(data.sess_id,null)){
		delete data.sess_id;
	}
	if (type == 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		});
		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}
	if (query && query.ctl) {
		let dataStr = ''; //数据拼接字符串
		Object.keys(query).forEach(key => {
			dataStr += key + '=' + query[key] + '&';
		});

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}
	if (window.fetch && method == 'fetch') {
		let requestConfig = {
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
		};
		if (type == 'POST') {
			delete requestConfig.headers;
			let formData = new FormData();
			if(data.file || data['file[]']){
				let params = 	Object.assign(data,query);
				Object.keys(params).map((key) => {
					if(Object.is(key,'file[]')){
						params[key].forEach((item) => {
							formData.append(key,item);
						});
					}
					if(!Object.is(key,'file[]')){
						formData.append(key,params[key]);
					}
				});
			}else{
				formData.append('requestData', JSON.stringify(Object.assign(data,query)));
			}
			requestConfig.contentType = false;
			requestConfig.processData = false;
			requestConfig.body = formData;
		}
		try {
			const response = await fetch(url, requestConfig);
			const responseJson = await response.json();
			return responseJson;
		} catch (error) {
			throw new Error(error);
		}
	} else {
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new window.ActiveXObject;
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}
			requestObj.open(type, url, true);
			requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			requestObj.send(sendData);
			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response;
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj);
					} else {
						reject(requestObj);
					}
				}
			};
		});
	}
};

