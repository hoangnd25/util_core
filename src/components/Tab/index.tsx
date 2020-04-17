import React, { Component } from 'react';
import { Tab } from '@go1d/go1d';

interface TabOptionProps {
  activeTab: string;
  label: string;
  onClick: (label) => void;
}

class TabOption extends Component<TabOptionProps> {
  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  };

  render() {
    const { activeTab, label } = this.props;

    return (
      <Tab isSelected={activeTab === label ? true : false} onClick={this.onClick}>
        {label}
      </Tab>
    );
  }
}

export default TabOption;
