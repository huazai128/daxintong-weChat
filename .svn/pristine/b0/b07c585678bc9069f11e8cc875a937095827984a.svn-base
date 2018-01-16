import React, { Component } from 'react';
import { ActivityIndicator } from 'antd-mobile';

export default importComponent => {
	return class extends Component {
		constructor(props) {
			super(props);
			this.state = {
				component: null,
			};
		}
		async componentDidMount() {
			const { default: component } = await importComponent();
			this.setState({ component });
		}
		render() {
			const C = this.state.component;
			return C
				? <C {...this.props} />
				:
				<div className="flex-center mt20">
					<ActivityIndicator animating />
				</div>;
		}
	};
};
