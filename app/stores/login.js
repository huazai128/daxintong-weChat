import { observable, computed, useStrict, action, runInAction, autorun } from 'mobx';
import apiUrl from 'utils';
import { setStore,removeStore } from 'utils/store';
import { ListView, Toast } from 'antd-mobile';

useStrict(true);
class Store{
	url = [
		{ // 密码登录
			ctl: 'user',
			act: 'dologin',
		},
		{ // 手机登录
			ctl: 'user',
			act: 'dophlogin',
		}
	]
	AlreadyCompleted = false;
	@observable userId = ''; // token
	@observable userData = {}; // 用户信息
	@observable result = []; // 登录返回结果
	@observable isLogin = false; // 判断是否登录
	@observable userInfo = {}; // 个人中心信息
	@observable info = {}; // 个人资料

	// 获取个人中心
	@action getAccountInfo = async (data) => {
		const res = await apiUrl('',Object.assign({	ctl: 'user_center',act: 'index',},data));
		runInAction(() => {
			if(res.code == 0){
				this.userInfo = res.result;
				this.AlreadyCompleted = false;
			}
		});
	}
	// 获取个人资料
	@action getInformation = async (data) => {
		const params = Object.assign({
			ctl:'user_center',
			act:'user_info'
		},data);
		const res = await apiUrl('',params);
		runInAction(() => {
			if(res.code == 0){
				this.info = res.result;
				this.AlreadyCompleted = false;
			}
		});
	}
	// 退出
	@action getQuit = async(data) => {
		const params = Object.assign({
			ctl:'user',
			act:'loginout'
		},data);
		const res = await apiUrl('',params);
		runInAction(() => {
			if(res.code == 0){
				this.isLogin = false;
				removeStore('isLogin');
				removeStore('expired');
				removeStore('userId');
				this.AlreadyCompleted = false;
			}
		});
	}
}

const store = new Store();
export default store;
