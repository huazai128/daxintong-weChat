import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './evaluate.scss';
import { List, TextareaItem, ImagePicker, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { urlAPi } from 'service/api';
import { hashHistory } from 'react-router';
import lrz from 'lrz';
const wx = window.wx;

const IconStar = CSSModules(({ no, url, selectStar }) => (
	<i onClick={selectStar} styleName="icon"><img src={url} /></i>
), require('./evaluate.scss'));

const comments = ['差', '一般', '好', '很好', '非常好'];
@CSSModules(styles)
class Evaluate extends Component {
	constructor() {
		super();
		this.state = {
			star: 5,
			files: [],
			multiple: false,
			isBtn: false,
			isFormat: false,
			imgs: []
		};
	}
	componentDidMount() {
	}
	addEvaluate = async () => {
		const { data_id, type, } = this.props.modelData;
		if (this.state.isBtn) return false;
		this.setState({
			isBtn: true,
		});
		const content = this.props.form.getFieldValue('content');
		const { star, files } = this.state;
		if (!content) {
			Toast.info('请输入您的评论', 2, null, false);
			this.setState({
				isBtn: false,
			});
			return false;
		}
		if (this.state.isFormat) {
			Toast.info('不支持script标签', 2, null, false);
			this.setState({
				isBtn: false,
			});
			return false;
		}
		const params = {
			data_id: data_id,
			type: type,
			content: content,
			point: star,
			'file[]': files.map((item) => item.file)
		};
		this.uploadImg(params);
	}
	// upload = () => {
	// 	wx.ready(() => {
	// 		wx.chooseImage({
	// 			count: 9, // 默认9
	// 			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	// 			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	// 			success: (res) => {
	// 				var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
	// 				let files = [];
	// 				localIds.forEach((localId) => {
	// 					wx.getLocalImgData({
	// 						localId: localId, // 图片的localID
	// 						success:  (res) => {
	// 							files.push(res.localData); // localData是图片的base64数据，可以用img标签显示
	// 						}
	// 					});
	// 				});
	// 				this.setState({
	// 					files:files
	// 				});
	// 			}
	// 		});
	// 	});
	// }
	uploadImg = async (params) => {
		Toast.info('上传图片中...', 10);
		const res = await urlAPi.addEvaluate(params);
		Toast.info(res.message, 2, null, false);
		if (Object.is(res.code, 0)) {
			this.props.modelData.refresh();
			hashHistory.goBack();
		} else {
			this.setState({
				isBtn: false,
			});
			setTimeout(() => {
				Toast.hide();
			}, 3000);
		}
	}
	onChange = async (files, type, index) => {
		if (this.state.files.length > 9 || files.length > 9) {
			Toast.info('只能上传9张图片', 2);
			this.setState({
				files: []
			});
			return false;
		}
		let newFiles = await files.map((item) => {
			lrz(item.file).then((res) => {
				item.file = res.file;
			})
				.catch(() => {
				});
			return item;
		});
		this.setState({
			files: newFiles
		});
	}
	selectStar = (index) => {
		this.setState({
			star: index
		});
	}
	componentWillUnmount() {
		this.setState({
			isBtn: false,
		});
	}
	render() {
		const { star, files, multiple } = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<div className="flex-col">
				<div className="flex-g-1 scroll-absolute">
					<div styleName="ev-box">
						<div styleName="ev-star">
							<div className="flex-hcenter mb80">
								<div styleName="rating" >
									<div styleName="star" className="flex jc-between">
										{Array.from({ length: 5 }).map((item, index) => (
											<IconStar selectStar={() => this.selectStar(index + 1)} url={require('images/star.svg')} key={index}></IconStar>
										))}
									</div>
									<div style={{ width: ` ${((star * (89 + 5)) / 100)}rem` }} styleName="overfl">
										<div className="flex jc-between" styleName="star">
											{Array.from({ length: 5 }).map((item, index) => (
												<IconStar selectStar={() => this.selectStar(index + 1)} url={require('images/star_1.svg')} key={index}></IconStar>
											))}
										</div>
									</div>
								</div>
							</div>
							<p>{comments[star - 1]}</p>
						</div>
						<div styleName="ev-text" className="mb25">
							<List>
								<TextareaItem
									placeholder="团购商品如何？服务如何？环境如何？快来说说吧！"
									{...getFieldProps('content', {
										initialValue: '',
										rules: [
											{
												validator: (rule, value, callback) => {
													if (/<script.*?>.*?<\/script>/ig.test(value)) {
														callback('不支持script标签');
														this.setState({
															isFormat: true
														});
													} else {
														callback();
														this.setState({
															isFormat: false
														});
													}
												}
											}
										]
									}) }
									rows={5}
									count={120}
								/>
							</List>
						</div>
						<div className="upload-img">
							{/* <div className="am-image-picker-list" role="group">
								<div className="am-flexbox am-flexbox-align-center ">
									{files.length > 0 && (
										files.map((file) => {
											return (<div className="am-flexbox-item"><img src={file} /></div>);
										})
									)}
									<div className="am-flexbox-item">
										<div className="am-image-picker-item am-image-picker-upload-btn" onClick={this.upload}></div>
									</div>

								</div>
							</div> */}

							<ImagePicker
								files={files}
								onChange={this.onChange}
								onImageClick={(index, fs) => console.log(index, fs)}
								selectable={files.length < 9}
								multiple={this.state.multiple}
							/>
						</div>
					</div>
				</div>
				<div className="ev-sure">
					<div styleName="ev-btn" onClick={this.addEvaluate}>确认发布</div>
				</div>
			</div>
		);
	}
}

export default createForm()(Evaluate);
