import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Tab } from '@go1d/go1d';

interface TabOptionProps {
  activeTab: string;
  label: string;
  onClick: (label:string) => void;
}

const TabOption = ({activeTab, label, onClick}: TabOptionProps) => (
  <Tab 
    isSelected={activeTab === label} 
    onClick={() => onClick(label)}
  >
    {label}
  </Tab>
)

class TabMenuNavigation extends Component<{ children }, any> {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    onClickTabItem: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: props.children[0].props.label,
    };
  }

  onClickTabItem = tab => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { children } = this.props;
    const { activeTab } = this.state;

    return (
      <>
        <View flexDirection="row" borderBottom={2} color="faded">
          {children.map(({ props:{ label } }) => (
            <View key={label} marginBottom={-1}>
              <TabOption activeTab={activeTab} label={label} onClick={this.onClickTabItem} />
            </View>
          ))}
        </View>

        {children.map(child => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </>
    );
  }
}

export default TabMenuNavigation;
