// 缓存

var localCache = {};

export const setStore = (name,content) => {
	if(!name) return;
	if(typeof  content !== 'string'){
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name,content);
	localCache[name] = content;
};

// 获取缓存
export const getStore = (name) => {
	if(!name) return false;
	if(localCache.hasOwnProperty(name)){
		return localCache[name];
	}else{
		return window.localStorage.getItem(name);
	}
};

// 清除
export const removeStore = (name) => {
	if(!name) return;
	window.localStorage.removeItem(name);
	delete localCache[name];
};
