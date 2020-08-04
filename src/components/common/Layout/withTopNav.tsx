import * as React from "react";
import { View, Container, Text } from '@go1d/go1d';
import TopMenu from '@go1d/mine/common/TopMenu';
import { getNested } from '@go1d/mine/utils';
import { UserModel, PortalModel, AccountModel } from '@go1d/go1d-exchange';
import { connect } from "react-redux";
import { mapCurrentSessionToProps } from '../WithAuth';

const LayoutWithNav = (props) => {
  const { currentSession } = props;
  const user = new UserModel(currentSession.user || {});
  const portal = new PortalModel(currentSession.portal || {});
  return (
      <TopMenu
        userName={`${user.firstName} ${user.lastName}`}
        userAvatar={user.avatar}
        portalIcon={getNested(portal.files, "dashboard_icon")}
        portalConfig={portal.configuration || {}}
        account={currentSession.account}
        featureToggles={currentSession.portal.featureToggles}
      />
    );
};

export default connect(
  mapCurrentSessionToProps,
  null
)(LayoutWithNav);
