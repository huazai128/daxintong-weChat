import React,{ Component } from 'react';
import { hashHistory } from 'react-router';
import './nav.scss';

export default class NavBox extends Component {
	constructor(porps){
		super(porps);
	}
	render() {
		const { title } = this.props;
		return (
			<div className="fw-header flex-vcenter">
				<div className="hideView flex-col-3">
					<div onClick={ () =>{
						hashHistory.goBack();
					} }>
						<i className="icon-back"></i>
						<span></span>
					</div>
				</div>
				<h1 className="viewTitle flex-col-6">{ title }</h1>
				<div className="flex-col-3">
					{ this.props.children }
				</div>
			</div>
		);
	}
}

