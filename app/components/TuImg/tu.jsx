import React,{ Component } from 'react';
import { codeImg } from 'utils';
import { getStore } from 'utils/store';
import './tu.scss';


export default class TuImg  extends Component {
	constructor(props){
		super(props);
		this.state = {
			imgstate: new Date().getTime(),
			url: ''
		};
	}
	componentDidMount(){
		let { imgstate } = this.state;
		this.getUrlInit(imgstate);
	}
	getUrlInit = (imgstate) => {
		let sess_id = getStore('sess_id');
		let urlImg =  codeImg + '?sess_id=' + sess_id + '&date=' + imgstate;
		this.setState({
			url:urlImg
		});
	}
	update = () => {
		this.getUrlInit(new Date().getTime());
	}
	render() {
		const { url } = this.state;
		return (
			<div>
				<div className="tu-box"><img src={ url } onClick={() => { this.update(); }} /></div>
			</div>
		);
	}
}
