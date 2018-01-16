import { observable, computed, useStrict, action, runInAction, autorun } from 'mobx';
import { getApi, postApi } from 'utils';
import { ListView, Toast } from 'antd-mobile';

useStrict(true);
class Store {
	@observable isFooter = true
	@action onChange = (flag) => {
		this.isFooter = flag;
	}
}
const store = new Store();
export default store;
