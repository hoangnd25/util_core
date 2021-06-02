import React, { ReactNode } from 'react';
import { SIDEBAR_MENUS_SETTINGS } from '@src/constants';
import withAuth from '@src/components/common/WithAuth';
import withApiom from '@src/components/common/WithApiom';
import { View, NotificationManager } from '@go1d/go1d';
import { CurrentSessionType } from '@src/types/user';
import createPortalService from '@src/services/portalService';
import CloudinaryService from '@go1d/mine/services/cloudinary';
import AppContext from '@src/utils/appContext';
import axios, { CancelToken } from 'axios';
import ThemeSettingsForm from '@src/components/Settings/Theme/Form';
import { FormSaveError, ApplyCustomizationdError, ImageUploadError } from '@src/components/Settings/Theme/errors';
import { Trans } from '@lingui/macro';
import { WithRouterProps } from 'next/dist/client/with-router';
import { DispatchProp } from 'react-redux';
import { USER_UPDATE } from '@src/reducers/session';

export interface ThemeSettingsPageProps extends WithRouterProps, DispatchProp {
  currentSession: CurrentSessionType;
}

interface State {
  isSaving: boolean;
}

const ToastOptions = {
  lifetime: 3000,
  isOpen: true,
};

export class ThemeSettingsPage extends React.Component<ThemeSettingsPageProps, State> {
  context: React.ContextType<typeof AppContext>;

  constructor(props: ThemeSettingsPageProps) {
    super(props);

    this.state = {
      isSaving: false,
    };
  }

  componentDidMount() {
    const { currentSession: { portal } } = this.props;
    // If FT toggle for portal is enabled and they have not upgraded kick them back to apiom.
    if (portal.featureToggles?.some((featureToggle) => featureToggle.raw?.name === 'login.version.upgrade.banner' && featureToggle.raw?.enabled)) {
      if (portal.configuration?.login_version !== 'peach') {
        window.location.assign(`https://${portal.title}/p/#/app/settings/theme`)
      }
    };
  }

  handleImageUpload = async (image: File | Blob, cancelTokenSource?: CancelToken) => {
    const {
      currentSession: { account },
    } = this.props;

    const { http } = this.context;
    const cloudinaryService = new CloudinaryService(http);
    const cancelToken = cancelTokenSource || axios.CancelToken.source();

    this.setState({ isSaving: true });
    
    try {
      return await cloudinaryService.uploadImage(
        {
          file: image as File,
          mail: account.mail,
        },
        cancelToken
      );
    } catch (error) {
      throw new ImageUploadError(error.message);
    }
  };

  handleError = (message: ReactNode) => {
    this.setState({ isSaving: false });
    NotificationManager.warning({
      message,
      options: ToastOptions,
    });
  };

  refreshSession = (fields: object) => {
    const { dispatch, currentSession } = this.props;

    if (currentSession) {
      const { portal } = currentSession;
      
      dispatch({
        type: USER_UPDATE,
        payload: {
          ...currentSession,
          portal: {
            ...portal,
            data: {
              ...portal.data,
              theme: {
                ...portal.data.theme,
                primary: fields['theme.primary'],
              }
            }
          }
        },
      }) 
    }
  }

  handleSave = async (fields: object, childCustomizationGroups: string[] = []) => {
    const {
      currentSession: { portal },
    } = this.props;
    const { http } = this.context;
    const portalService = createPortalService(http);

    this.setState({ isSaving: true });

    try {
      await portalService.save(portal.title, fields);
    } catch (saveError) {
      throw new FormSaveError(saveError.message);
    }

    if (childCustomizationGroups.length > 0) {
      try {
        await portalService.applyChildPortalCustomization(portal.title, childCustomizationGroups);
      } catch (applyCustomizationdError) {
        throw new ApplyCustomizationdError(applyCustomizationdError.message);
      }
      
      this.setState({ isSaving: false });
    }

    this.refreshSession(fields);
    this.toastSuccess(
      <Trans>The settings have been saved.</Trans>
    );
  };

  toastSuccess(message: ReactNode) {
    NotificationManager.success({
      message,
      options: ToastOptions,
    });
  }

  public render() {
    const { isSaving } = this.state;
    const {
      currentSession: { portal },
    } = this.props;

    return (
      <View data-testid="theme_settings_page">
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

export default withAuth(withApiom(ThemeSettingsPage, { pageTitle: <Trans>Theme and customization</Trans>, active: SIDEBAR_MENUS_SETTINGS.THEME, menuType: "Settings" },  ));
