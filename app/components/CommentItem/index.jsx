import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import RatingStar from 'components/RatingStar/star';
import { PhotoSwipeGallery, PhotoSwipe } from 'react-photoswipe';
import 'react-photoswipe/lib/photoswipe.css';
import './index.scss';
let wx = window.wx;

class CommentItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oimages: [],
			width: 0,
		};
	}
	componentDidMount() {
		let width = (document.body.clientWidth - this.refs.boxs.getBoundingClientRect().left) - 25;
		this.setState({
			width: width,
		});
	}
	// 图片预览
	showImg = (img, arrImg) => {
		wx.ready(() => {
			wx.previewImage({
				current: img, // 当前显示图片的http链接
				urls: arrImg // 需要预览的图片http链接列表
			});
		});
	}
	render() {
		const options = {
			escKey: false,
			shareButtons: [],
			shareEl: false
		};
		let { datas } = this.props;

		return (
			<div className="com-items" key={datas.id} >
				<div className={`com-item-box ${this.props.status ? 'border-1' : ''}`}>
					<div className="mr20 avatar avatar" ref="avatar"><img src={datas.user_avatar} /></div>
					<div className="com-data" ref="boxs">
						<div className="flex jc-between">
							<h4>{datas.user_name}</h4>
							<RatingStar isHide={true} star={datas.point}></RatingStar>
						</div>
						<div className="com-width mb10" style={{ width:this.state.width+'px' }}>{datas.content}</div>
						<div className="pswiper-box ">
							{datas && datas.images && datas.images.length > 0 && <div className="flex" > {datas.images.slice(0, 4).map((item, index) => {
								return (
									<img className="mr10" key={index} src={item} onClick={() => { this.showImg(datas.oimages[index], datas.oimages); }} />
								);
							})}</div>}
							{datas && datas.images && datas.images.length > 4 ? <div className="psweiper-num">{datas.images.length}</div> : null}
						</div>
						<p className="mt5">{datas.create_time}</p>
					</div>
				</div>
			</div>
		);
	}
}
export default CommentItem;
