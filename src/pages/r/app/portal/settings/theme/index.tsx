import * as React from 'react';
import { Spinner, Text, View, ButtonFilled, ImageUploader, Form, Field, SubmitButton } from '@go1d/go1d';
import CloudinaryService from "@go1d/mine/services/cloudinary"
import { SIDEBAR_MENUS_SETTINGS } from '@src/constants';
import { CurrentSessionType } from '@src/types/user';
import { Trans } from '@lingui/macro';
import withAuth from '@src/components/common/WithAuth';
import WithApiom from '@src/components/common/WithApiom';
import AppContext from '@src/utils/appContext';
import axios from "axios";
import { FormikConfig } from 'formik';
import PortalService from '@src/services/portalService';
import { ThemeBlockMaker } from '@src/components/ThemeBlockMaker';

const FEATURED_IMAGE_RATIO = 1;

interface HeaderMakerProps {
  title: React.ReactNode
}

export const HeaderMaker: React.FunctionComponent<HeaderMakerProps> = ({
  title,
  children,
}) => {
  return (
    <View marginBottom={5} flexDirection="row" justifyContent="space-between" alignItems="center">
      <Text element="h1" fontSize={3} fontWeight="semibold">
        {title}
      </Text>
      {children}
    </View>
  )
}
export interface Props {
  currentSession: CurrentSessionType;
}

interface Fields {
  featuredImage: string | Blob;
}
interface State {
  isSaving: boolean;
  fields: Fields;
  error: string | null;
}

export class ThemeSettingsPage extends React.Component<Props, State> {
  context: React.ContextType<typeof AppContext>;

  constructor(props: Props) {
    super(props);

    const { currentSession: { portal } } = this.props;
    // @ts-ignore then should add to exchange model
    const featuredImage: string = portal.files?.feature_image;

    this.state = {
      isSaving: false,
      fields: {
        featuredImage,
      },
      error: null,
    };
  }
  
  handleFieldChange = (e: any) => {
    const { name, value } = e.target;

    this.setField(name, value);
  }

  setField = <K extends keyof Fields, T>(name: K, value: Fields[K]) => {
    this.setState((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: value,
      }
    }))
  }

  handleSubmit: FormikConfig<Fields>['onSubmit'] = async (_values, form) => {
    const { currentSession: { account, portal } } = this.props
    const { fields } = this.state;

    // user has selected a different image
    if (fields.featuredImage instanceof Blob) {
      this.setState({ isSaving: true });

      const { http } = this.context;
      const cloudinaryService = new CloudinaryService(http);
      const portalService = PortalService(http);

      // not sure why values doesn't change???
      // console.log(fields.featuredImage, values);
      const { CancelToken } = axios;
      const source = CancelToken.source();

      const featuredImageUrl = await cloudinaryService.uploadImage({
        file: fields.featuredImage as File,
        mail: account.mail,
      }, source.token);

      await portalService.save(portal.title, {
        'files.feature_image': featuredImageUrl,
      });

      // clearance
      // this will help to prevent from saving many times until user has moved the image
      this.setField('featuredImage', featuredImageUrl);
      this.setState({ isSaving: false });
    }

    form.setSubmitting(false);
  }

  handleCropImage = (field: keyof Fields, croppedImage: Blob) => {
    const { fields } = this.state;
    // Make sure this callback is only changed as we changed image
    if (typeof fields.featuredImage !== 'string') {
      this.setField(field, croppedImage);
    }
  }

  public render() {
    const { fields, isSaving } = this.state;

    return (
      <View data-testid="theme_settings_page">
        <Form initialValues={fields} onSubmit={this.handleSubmit}>
          <HeaderMaker title={<Trans>Brand</Trans>}>
            <ButtonFilled>
              <Trans>Preview brand</Trans>
            </ButtonFilled>
          </HeaderMaker>

          <ThemeBlockMaker 
            title={<Trans>Featured image</Trans>} 
            description={<Trans>Used in sign up and login pages. For best results, upload an image in X:Y ratio. The image can also be repositioned.</Trans>}
          >
            <View padding={4} borderRadius={2} border={1} borderColor="delicate" css={{
              borderStyle: 'dashed',
            }}>
              <Field 
                name="featuredImage" 
                allowCrop
                hideLabel
                component={ImageUploader} 
                height={400} 
                onChange={this.handleFieldChange} 
                cropConfig={{
                  aspect: FEATURED_IMAGE_RATIO,
                  onCrop: this.handleCropImage.bind(this, 'featuredImage'),
                }}
              />
            </View>
          </ThemeBlockMaker>

          <View flexDirection="row" marginTop={5}>
            <SubmitButton color="accent" flexDirection="row" alignItems="center">
              <View flexDirection="row" alignItems="center">
                {isSaving && <Spinner color="white" marginRight={2} />}
                <Trans>Save</Trans>
              </View>
            </SubmitButton>
          </View>
        </Form>
      </View>
    );
  }
}

ThemeSettingsPage.contextType = AppContext

export default withAuth(WithApiom(ThemeSettingsPage, { pageTitle: <Trans>Theme and customization</Trans>, active: SIDEBAR_MENUS_SETTINGS.THEME, menuType: "Settings" },  ));