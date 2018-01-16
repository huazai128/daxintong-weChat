import React ,{ Component } from 'react';
import { createForm } from 'rc-form';
import { List, InputItem, Button,Toast } from 'antd-mobile';
import './index.scss';

@createForm()
class DxPass extends Component {
	constructor(props){
		super(props);
	}
	render(){
		const { form:{ getFieldProps },confirm,cancel } = this.props;
		return(
			<div className="dx-box flex-center">
				<div>
					<div className="dx-pass">
						<h4>确认支付</h4>
						<InputItem className="dx-input"
							{...getFieldProps('daxt_paw')}
							type="number"
							placeholder="请输入密码(如无密码,直接点击确认)"
						></InputItem>
						<div className="dx-btns flex">
							<div className="flex-g-1" onClick={() => { confirm(this.props.form.getFieldValue('daxt_paw')); }}>确认</div>
							<div className="flex-g-1 cancel" onClick={() => { cancel(); }}>取消</div>
						</div>
					</div>
				</div>

			</div>
		);
	}
}
export default DxPass;

