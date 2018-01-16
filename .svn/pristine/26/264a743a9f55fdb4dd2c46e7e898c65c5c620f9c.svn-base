
export default async (url = '', data = {}, type = 'GET', query = {}, method = 'fetch') => {
	type = type.toUpperCase();
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
			// credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			// cache: 'force-cache'
		};
		if (type == 'POST') {
			delete requestConfig.headers;
			let formData = new FormData();
			if(data.file || data['file[]']){
				let params = 	Object.assign(data,query);
				Object.keys(params).map((key) => {
					formData.append(key,params[key]);
				});
			}else{
				formData.append('requestData', JSON.stringify(Object.assign(data,query)));
			}
			requestConfig.contentType = false;
			requestConfig.processData = false;
			requestConfig.body = formData;
		}
		try {
			// alert(url);

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

