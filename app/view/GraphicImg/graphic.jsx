import React, { Component } from 'react';
import './graphic.scss';
import { urlAPi } from 'service/api';

class GraphicImg extends Component{
	constructor(props){
		super(props);
		this.state = {
			info:{}
		};
	}
	componentDidMount(){
		const { id } = this.props.modelData;
		urlAPi.graphic({data_id:id}).then((res) => {
			if(!res.code){
				this.setState({
					info:res.result
				});
			}
		});
	}
	render(){
		const { info } = this.state;
		const { description } = this.props.modelData;
		let detail = description || info.description;
		return(
			<div className="graphic-boxs">
				<div>
					<p>{info.name}</p>
					<div className="graphic-lists">
						<div dangerouslySetInnerHTML={{
							__html:detail && detail.replace(/\d+(\.\d+)?px/g, function (s, t) {
								s = s.replace('px', '');
								var value = Number(s) * 0.02;//   此处 1rem =120px
								return value + 'rem ';
							})
						}}></div>
					</div>
				</div>
			</div>
		);
	}
}

export default GraphicImg;
