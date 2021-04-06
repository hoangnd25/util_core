import React, { ReactNode } from 'react';
import { SIDEBAR_MENUS_SETTINGS } from '@src/constants';
import withAuth from '@src/components/common/WithAuth';
import withSettings from '@src/components/common/WithSettings';
import { View, NotificationContainer, NotificationManager } from '@go1d/go1d';
import { CurrentSessionType } from '@src/types/user';
import createPortalService from '@src/services/portalService';
import CloudinaryService from '@go1d/mine/services/cloudinary';
import AppContext from '@src/utils/appContext';
import axios, { CancelToken } from 'axios';
import ThemeSettingsForm from '@src/components/Settings/Theme/Form';
import { Trans } from '@lingui/macro';

export interface ThemeSettingsPageProps {
  currentSession: CurrentSessionType;
}

interface State {
  isSaving: boolean;
}

export class ThemeSettingsPage extends React.Component<ThemeSettingsPageProps, State> {
  context: React.ContextType<typeof AppContext>;

  constructor(props: ThemeSettingsPageProps) {
    super(props);

    this.state = {
      isSaving: false,
    };
  }

  handleImageUpload = (image: File | Blob, cancelTokenSource?: CancelToken) => {
    const {
      currentSession: { account },
    } = this.props;

    const { http } = this.context;
    const cloudinaryService = new CloudinaryService(http);

    const cancelToken = cancelTokenSource || axios.CancelToken.source();

    return cloudinaryService.uploadImage(
      {
        file: image as File,
        mail: account.mail,
      },
      cancelToken
    );
  };

  handleError = (message: ReactNode) => {
    NotificationManager.warning({
      message,
      options: {
        lifetime: 3000,
        isOpen: true,
      },
    });
  };

  handleSave = async (fields: object) => {
    const {
      currentSession: { portal },
    } = this.props;
    const { http } = this.context;
    const portalService = createPortalService(http);

    this.setState({ isSaving: true });

    try {
      await portalService.save(portal.title, fields);
    } catch (error) {
      this.handleError(<Trans>An unexpected error has occurred, please try again.</Trans>);

      if (__DEV__) {
        console.error(error);
      }
    }

    this.setState({ isSaving: false });
  };

  public render() {
    const { isSaving } = this.state;
    const {
      currentSession: { portal },
    } = this.props;

    return (
      <View data-testid="theme_settings_page">
        <NotificationContainer />
        <ThemeSettingsForm
          portal={portal}
          isSaving={isSaving}
          onSave={this.handleSave}
          onUpload={this.handleImageUpload}
          onError={this.handleError}
        />
      </View>
    );
  }
}

ThemeSettingsPage.contextType = AppContext;

export default withAuth(
  withSettings(ThemeSettingsPage, {
    pageTitle: <Trans>Theme and customization</Trans>,
    active: SIDEBAR_MENUS_SETTINGS.THEME,
  })
);
