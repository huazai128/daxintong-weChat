import React from 'react';
import ReactDOM from 'react-dom';
import './subView.scss';
import { hashHistory } from 'react-router';

let startingZIndex = 400;

class SubViewHandle {
	constructor() {
		let self = this;
		this.subNodeMap = {};
		this.config = {};
		this.Nodes = [];

		this.originHash = window.location.hash.split('?')[0].replace(/[#//?]/g, '');
		this.originSubLen = this.subNodeMap[this.originHash];
		setInterval(() => {
			let nowHash = window.location.hash.split('?')[0].replace(/[#//?]/g, '');

			if (this.originHash !== nowHash) {
				//路由有变化
				if (nowHash.indexOf('_') !== -1) {
					this.nowSubLen = this.subNodeMap[nowHash];
					//有滑出来子页面
					this.historyPop(this.nowSubLen < this.originSubLen, this.originHash);
				} else {
					//有滑出来子页面
					this.popAllView();
				}
			} else if (this.originHash.indexOf('_') !== -1 && this.Nodes.length === 0) {
				//路由没变化,路径带有_,且没有画出来的页面
				let path = window.location.hash.split('_')[0].replace(/[#//?]/g, '');
				hashHistory.push(path);
			}
			this.originHash = nowHash;
			this.originSubLen = this.nowSubLen;
		}, 150);
	}


	// historyPush(replace) {
	// 	this.subpop = true;
	// 	let hash = window.location.hash.split('_')[0].replace(/[#//?]/g, '');
	// 	if (replace) {
	// 		hashHistory.replace(hash + '_' + (this.Nodes[this.Nodes.length - 1][2]) + this.Nodes.length);
	// 	} else {
	// 		hashHistory.push(hash + '_' + (this.Nodes[this.Nodes.length - 1][2]) + this.Nodes.length);
	// 	}
	// }

	historyPush(replace) {
		let hash = window.location.hash.split('?')[0].replace(/[#//?]/g, ''); //根
		hash = hash.split('_')[0].replace(/[#//?]/g, ''); //根
		let name = hash + '_' + (this.Nodes[this.Nodes.length - 1][2]) + '[' + this.Nodes.length + ']';
		this.subNodeMap[name] = this.Nodes.length;
		if (replace) {
			hashHistory.replace(name);
		} else {
			hashHistory.push(name);
		}

	}

	// historyPop() {
	// 	if (!this.subpop && this.Nodes.length > 0) {
	// 		this.fallBack();
	// 	} else if (this.Nodes.length === 0) {
	// 		let hash = window.location.hash.split('_')[0].replace(/[#//?]/g, '');
	// 		hashHistory.push(hash);
	// 	}
	// 	this.subpop = false;
	// }

	historyPop(flag, originHash) {
		if (flag === true) {
			delete this.subNodeMap[originHash];
			//销毁当前的子页面
			this.popView();
		} else {
			//新的子页面进来
			// this.historyPush();
		}
	}

	fallBack(cb) {
		var self = this;

		self.popView();
		if (cb) {
			cb();
		}
	}
	close() { // 返回按钮 函数
		this.subpop = false;
		hashHistory.goBack();
	}
	popView() {
		if (this.Nodes.length > 0) {
			startingZIndex -= 1;
			let n = this.Nodes.pop();
			let node = n[0];
			n[1].back(() => {
				ReactDOM.unmountComponentAtNode(node);
				node.parentNode.removeChild(node);
			});
		}
	}
	popAllView() {
		while (this.Nodes.length > 0) {
			startingZIndex = 400;
			let n = this.Nodes.pop();
			let node = n[0];
			// ReactDOM.unmountComponentAtNode(node);
			// node.parentNode.removeChild(node);
			n[1].back(() => {
				ReactDOM.unmountComponentAtNode(node);
				node.parentNode.removeChild(node);
			});
		}
	}

	replaceView(viewName, config) {
		let self = this;
		if (this.Nodes.length > 0) {
			// let n = this.Nodes.pop();
			// let node = n[0];
			//this.fallBack(function () {
			//this.pageAnimation(this.config, 'out');
			self.popView();
			self.pushView(viewName, config, true);
			// });
		} else {
			this.pushView(viewName, config);
		}
	}
	pushView(viewName, config, replace) {
		replace = config.replace || replace;
		let self = this;
		let node = document.createElement('div');
		node.style.overflow ='hidden';
		document.body.appendChild(node);
		let reactNode = ReactDOM.render(
			<SubView config={config} viewName={viewName} />, node);
		this.Nodes.push([node, reactNode, viewName]);
		this.config = config;
		self.historyPush(replace);
	}
}

if (!window.subViewHandle) {
	window.subViewHandle = new SubViewHandle();
}
let subViewHandle = window.subViewHandle;

var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

const SubView = React.createClass({
	getInitialState() {
		this.iosMove = false;
		return { show: true, module: null, options: null, confirmButtonHtml: this.props.config.confirmButtonHtml };
	},
	componentDidMount() {
		this.span_move_fun();
		var self = this;
		window.SubViewRoutes[this.props.viewName](function (Module, options) {
			if (!options) {
				options = {};
			}
			self.state.module = <Module modelData={self.props.config.modelData || {}} subview={true} />;
			setTimeout(() => {
				self.setState({ module: self.state.module, options: options });
			}, 350);
		});
	},
	back(cb) {
		this.setState({
			show: !this.state.show,
		});
		if (!isiOS) {
			setTimeout(() => {
				cb();
			}, 300);
		} else {
			if (this.iosMove === true) {
				cb();
			} else {
				setTimeout(() => {
					cb();
				}, 300);
			}
		}
	},
	onEnd({ key, type }) {
		if (type === 'leave') {
			if (this.backCb) {
				this.backCb();
				this.backCb = null;
			}
		}
	},
	close() {
		subViewHandle.close();
	},
	span_move_fun() {
		let originScreenX = 0, nowScreenX = 0, originPageX = 0, nowPageX = 0, nowClientX = 0, originClientX = 0, left = 0;
		this.refs.subNode.addEventListener('touchend', (event) => {
			if (event.changedTouches.length == 1) {
				var touch = event.changedTouches[0];
				nowScreenX = touch.screenX;
				nowClientX = touch.clientX;
				nowPageX = touch.pageX;
				if (nowPageX < 0) {
					this.iosMove = true;
				}
			}
			// event.stopPropagation();
		});
	},
	render() {
		let node, backNode, confirmButtonNode, self = this, config = this.props.config, header, className;

		if (this.state.options) {
			if (this.state.confirmButtonHtml) {
				let confirmButtonHtml = this.state.confirmButtonHtml;
				confirmButtonNode = <div>{confirmButtonHtml}</div>;
			}
			if (!config.hideBack) {
				backNode = <div><i className="icon-back"></i><span></span></div>;
			}
		}
		if (config.hideBar !== true) {
			header = <div className="fw-header flex-vcenter">
				<div className="hideView flex-col-3" onClick={self.close.bind(self, null)}>
					<div><i className="icon-back"></i><span></span></div>
				</div>
				<h1 className="viewTitle flex-col-6">{config.title}</h1>
				<div className="flex-col-3">
					{confirmButtonNode}
				</div>
			</div>;
		}

		let moduleNode = <div className="subview-loading">
			<div className='loadpicture'></div>
		</div>;
		if (this.state.module) {
			moduleNode = this.state.module;
		}
		node = <div data-id={config.moduleName} className={(this.state.show ? 'movein' : 'moveout') + ' page ' + className} key={1} ref="subNode">
			{header}
			<div className="subview-content flex-g-1">
				{moduleNode}
			</div>
		</div>;


		// return (
		// 	<QueueAnim delay={100} duration={500} className="subview"
		// 		style={{ zIndex: startingZIndex++ }}
		// 		onEnd={this.onEnd}
		// 		animConfig={[
		// 			{ translateX: ['0%', '100%'] },
		// 			{ translateX: ['0%', '100%'] }
		// 		]}>
		// 		{node}
		// 	</QueueAnim>
		// );

		return <div className="subview" style={{ zIndex: startingZIndex++ }}>
			{node}
		</div>;
	}
});
const SubViewLink = React.createClass({
	onClick(e) {
		e.preventDefault();
		if (this.props.disabled) {
			return;
		}
		if (!window.SubViewRoutes[this.props.moduleName]) {
			console.log('moduleName页面模块名不存在:' + this.props.moduleName);
		}

		subViewHandle.pushView(this.props.moduleName, this.props);
	},
	render() {
		return <div onClick={this.onClick} className={this.props.className}>{this.props.children}</div>;
	}
});

export { SubViewLink, subViewHandle };

