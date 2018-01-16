import React,{ Component } from 'react';
import './index.scss';
import CSSModules from 'react-css-modules';
import { Toast } from 'antd-mobile';
import { urlAPi } from 'service/api';
import { hashHistory } from 'react-router';

class ConfirmHtml extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active:Object.is(props.isCollect,1) ? true : false
		};
	}
	// 收藏
	getShare = () => {
		urlAPi.collectionBusiniss({id:this.props.id}).then((res) => {
			Toast.info(res.message, 2, null, false);
			setTimeout(() => {
				Toast.hide();
			},3000);
			if(Object.is(res.code,0)){
				let act = res.result.is_collect;
				this.setState({
					active: Object.is(act,1) ? true : false
				});
				this.props.onChange(act);
			}
		});
	}
	render() {
		const { active } = this.state;
		return (
			<div className="share-btns flex jc-end">
				<div onClick={ this.getShare } className={ `star ${ active ? 'active':'' }` }></div>
				<div className="home" onClick={() => { hashHistory.push('/'); }}></div>
			</div>
		);
	}
}

export default ConfirmHtml;
