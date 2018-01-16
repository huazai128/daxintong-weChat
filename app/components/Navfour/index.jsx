import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { hashHistory } from 'react-router';
import { SubViewLink } from 'app/components/subViewLink/subViewLink';
import { observer, inject } from 'mobx-react';

@inject('login')
@observer
export default class extends Component {
	constructor(){
		super();
	}
	route = () => {
	}
	render() {
		const { path = '/', children } = this.props;
		return (
			<div>
				<NavBar style={{borderBottom:'1px solid #dddddd'}}
					mode="light"
					// icon={<Icon size="md" type="left"  style={{color:'#a3a3a3'}}/>}
					onLeftClick={() => hashHistory.push(path)}
					rightContent={
						<SubViewLink moduleName="register" title="注册" modelData={{store:this.props.login}}>
							<span style={{display:'block',width: '100%',height:'100%',lineHeight: '74px',textAlign:'right',color:'#333333'}}>注册</span>
						</SubViewLink>
					}
				>{children || '详情'}</NavBar>
			</div>
		);
	}
}
