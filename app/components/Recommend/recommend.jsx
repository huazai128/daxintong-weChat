import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';
import { urlAPi } from 'service/api';
import { Toast } from 'antd-mobile';
import ConfirmButton from 'components/ConfirmButton/';

@CSSModules(require('./recommend.scss'))
class Recommend extends Component{
	render(){
		const { title,datas } = this.props;
		return (
			<div styleName="rom-box">
				<h4>{ title }</h4>
				<div className="flex wrap">
					{ datas && datas.map((item) => {
						return(
							<div styleName="rom-item" key={item.id} className="flex-col-6">
								<SubViewLink moduleName="cateDetail" title="团购详情" modelData={{id:item.id}} confirmButtonHtml={<ConfirmButton onChange={(value) => { item.is_collect = value;}} id={item.id} item={item} isCollect={item.is_collect} />}  >
									<div styleName="rom-img"><img src={item.icon} /></div>
									<div styleName="rom-info">
										<h5>{item.name}</h5>
										<p>￥{item.current_price} <span>￥{ item.origin_price}</span></p>
									</div>
								</SubViewLink>
							</div>
						);
					})  }
				</div>
			</div>
		);
	}
}
export default Recommend;
