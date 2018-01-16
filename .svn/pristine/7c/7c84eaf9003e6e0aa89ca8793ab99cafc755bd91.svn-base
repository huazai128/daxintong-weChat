import React, { Component } from 'react';
import styles from './star.scss';

const IconStar = ({ no, url }) => (
	<i className={`${styles.icon}`}><img src={url} /></i>
);
class RatingStar extends Component {
	render() {
		const star = this.props.star ? this.props.star : 0;
		return (
			<div className="flex ">
				<div className={`${styles.rating}`}>
					<div className={`${styles.star} flex jc-between`}>
						{Array.from({ length: 5 }).map((item, index) => (
							<IconStar url={require('images/star.svg')} key={index}></IconStar>
						))}
					</div>
					<div style={{ width: ` ${((star * 34) / 100)}rem` }} className={styles.overfl}>
						<div className={`${styles.star} flex jc-between`}>
							{Array.from({ length: 5 }).map((item, index) => (
								<IconStar url={require('images/star_1.svg')} key={index}></IconStar>
							))}
						</div>
					</div>
				</div>
				{this.props.isHide ? '' : <p className={`${styles.psty} flex-g-1 `}>{star.toFixed(1)} {this.props.children}</p>}
			</div>
		);
	}
}
export default RatingStar;


