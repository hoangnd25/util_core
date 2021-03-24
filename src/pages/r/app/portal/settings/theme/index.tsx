import * as React from 'react';
import { Spinner, Text, View, ButtonFilled, Banner } from '@go1d/go1d';
import { SIDEBAR_MENUS_SETTINGS } from '@src/constants';
import { CurrentSessionType } from '@src/types/user';
import { Trans } from '@lingui/macro';
import withAuth from '@src/components/common/WithAuth';
import withSettings from '@src/components/common/WithSettings';

interface Props {
  currentSession: CurrentSessionType;
}

interface State {
  isLoading: boolean;
  error: any | null;
}

export class ThemeSettingsPage extends React.Component<Props, State> {
  state = {
    isLoading: false,
    error: null,
  };

  public render() {
    const { currentSession } = this.props;
    const { isLoading, error } = this.state;

    if (isLoading) {
      return (
        <View minHeight="60vh" justifyContent="center" alignItems="center">
          <Spinner size={3} />
        </View>
      );
    }
    return <View data-testid="theme_settings_page">This is where the portal theme fields will go...</View>;
  }
}

export default withAuth(withSettings(ThemeSettingsPage, { pageTitle: 'Theme and Customisation', active: SIDEBAR_MENUS_SETTINGS.THEME }));
