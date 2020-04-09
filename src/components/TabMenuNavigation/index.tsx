import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TabOption from '../Tab';
import { View } from '@go1d/go1d';

class TabMenuNavigation extends Component<{ children }, any> {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    onClickTabItem: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: this.props.children[0].props.label,
    };
  }

  onClickTabItem = tab => {
    this.setState({ activeTab: tab });
  };



  render() {
    const { children } = this.props;
    const { activeTab } = this.state;

    return (
      <View>
        <View flexDirection="row" borderBottom={2} color="faded">
          {children.map(child => {
            const { label } = child.props;
            return <TabOption activeTab={activeTab} key={label} label={label} onClick={this.onClickTabItem} />;
          })}
        </View>

        {children.map(child => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </View>
    );
  }
}

export default TabMenuNavigation;
