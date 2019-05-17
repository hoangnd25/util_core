import React from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../../reducers/account';

class WithUserComponent extends React.PureComponent<any> {
  public constructor(props) {
    super(props);

    const { account } = this.props;

    if (!account.status) {
      throw new this.props.authenticate();
    }
  }

  public componentDidMount() {
    this.props.authenticate();
  }

  public render() {
    const { children } = this.props;
    return (children as any)({
      account: this.props.account || {},
      authenticate,
    });
  }
}

const WithUser = connect(
  state => ({
    account: (state as any).account,
  }),
  {
    authenticate,
  }
)(WithUserComponent);

export default WithUser;

export const withUser = Component => {
  return props => <WithUser>{(...userProps) => <Component {...props} {...userProps} />}</WithUser>;
};
