import React from 'react';
import { string, func } from 'prop-types';
import { Modal, Select, Input, Form, Tooltip, Icon, Alert } from 'antd';
import { css } from 'emotion';

const { Option } = Select;

const formWrapper = css`
	.ant-form-item-label {
		line-height: 16px;
	}
`;

class QueryRuleModal extends React.Component {
	constructor(props) {
		super(props);
		const { query, operator } = props;
		this.state = {
			visible: false,
			query,
			operator,
		};
	}

	handleModal = () => {
		this.setState(prevState => ({
			visible: !prevState.visible,
		}));
	};

	isCurationChanged = () => {
		const { operator: propsOperator, query: propsQuery } = this.props;
		const { operator: stateOperator, query: stateQuery } = this.state;

		if (stateQuery.trim() === '' && stateOperator !== 'empty_query') {
			return true;
		}

		if (stateQuery !== propsQuery || propsOperator !== stateOperator) {
			return false;
		}
		return true;
	};

	handleOperator = value => {
		this.setState(prevState => ({
			operator: value,
			query: value === 'empty_query' ? '' : prevState.query,
		}));
	};

	handleQuery = e => {
		const {
			target: { value },
		} = e;
		this.setState({
			query: value,
		});
	};

	handleCuration = async () => {
		const { operator, query } = this.state;
		const { handleSuccess } = this.props;
		handleSuccess({ operator, query: query.toLowerCase() });
		this.handleModal();
	};

	render() {
		const { operator, query, visible } = this.state;
		const { renderButton } = this.props;
		return (
			<React.Fragment>
				{renderButton(this.handleModal)}
				<Modal
					title="Create Query Rule"
					visible={visible}
					okText="Continue"
					onOk={this.handleCuration}
					onCancel={this.handleModal}
					destroyOnClose
					okButtonProps={{
						disabled: this.isCurationChanged(),
					}}
				>
					<Form className={formWrapper}>
						<Form.Item
							label={
								<div className="ant-form-item-label">
									{/* eslint-disable-next-line */}
									<label title="Query">
										Query{' '}
										<Tooltip title="A query match is not case sensitive.">
											<Icon
												style={{ fontSize: 14 }}
												type="info-circle"
											/>
										</Tooltip>
									</label>
								</div>
							}
							colon={false}
						>
							<div
								style={{ margin: '0 0 6px' }}
								className="ant-form-extra"
							>
								When this query is typed by the user, this rule
								will get triggered.
							</div>
							<Input
								value={query}
								disabled={operator === 'empty_query'}
								placeholder={
									operator === 'empty_query'
										? `A query value isn't needed for empty_query operator`
										: 'Enter Query'
								}
								onChange={this.handleQuery}
							/>
						</Form.Item>
						<Form.Item label="Operator" colon={false}>
							<div
								style={{ margin: '0 0 6px' }}
								className="ant-form-extra"
							>
								Operator specifies how the match should be
								performed.
							</div>
							{operator === 'empty_query' ? (
								<Alert
									style={{ margin: '10px 0' }}
									message="An index can only have one empty_query operator. This allows promoting and hiding results when no search query is set."
									type="warning"
									showIcon
								/>
							) : null}
							<Select
								showSearch
								placeholder="Select a Operator"
								optionFilterProp="children"
								onChange={this.handleOperator}
								style={{ width: '100%' }}
								value={operator}
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
							>
								<Option value="is">is</Option>
								<Option value="starts_with">starts_with</Option>
								<Option value="ends_with">ends_with</Option>
								<Option value="contains">contains</Option>
								<Option value="empty_query">empty_query</Option>
							</Select>
						</Form.Item>
					</Form>
				</Modal>
			</React.Fragment>
		);
	}
}

QueryRuleModal.propTypes = {
	handleSuccess: func.isRequired,
	operator: string,
	query: string,
	renderButton: func.isRequired,
};

QueryRuleModal.defaultProps = {
	operator: 'is',
	query: '',
};

export default QueryRuleModal;
