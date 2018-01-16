import React ,{ Component } from 'react';
import './pop.scss';

export default class extends Component{
	constructor(props){
		super(props);
	}
	render(){
		const { onConfirm,onCancel } = this.props;
		return(
			<div className="pop-box flex-center" >
				<div className="pop-content">
					<div className="pop-show">
						<h3>确认取消订单?</h3>
						<div className="flex pop-btns">
							<div className="flex-col-6" onClick={ onCancel }>取消</div>
							<div className="flex-col-6" onClick={ onConfirm }>确认</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

