import { ButtonFilled, ColorPicker as BaseColorPicker, Field, ImageUploader, ImageUploadSlat, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsBlockMaker from '@src/components/Settings/SettingsBlockMaker';
import { FormikHandlers } from 'formik';
import { FunctionComponent } from 'react';
import SettingsFormSection from '../SettingsFormSection';

const FEATURED_IMAGE_RATIO = 1;

const DashedBorder: FunctionComponent = ({ children }) => (
  <View
    padding={4}
    borderRadius={2}
    border={1}
    borderColor="delicate"
    css={{
      borderStyle: 'dashed',
    }}
  >
    {children}
  </View>
);

interface Props {
  isSaving?: boolean;
  onFeaturedImageCropped?: (image: Blob) => void;
}

const ColorPicker: FunctionComponent<{
  name?: string;
  value?: string;
  error?: boolean | string;
  onChange?: FormikHandlers['handleChange'];
}> = ({ name, value, error, onChange, ...props }) => (
  <BaseColorPicker
    {...props}
    color={value}
    onChange={newColor => onChange?.({
      target: {
        name,
        value: newColor,
      },
    })}
  />
);

const SectionBrand: FunctionComponent<Props> = ({ isSaving, onFeaturedImageCropped }) => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Brand</Trans>}
          actionButton={
            <ButtonFilled>
              <Trans>Preview brand</Trans>
            </ButtonFilled>
          }
        >
          <SettingsBlockMaker
            marginBottom={5}
            title={<Trans>Logo</Trans>}
            description={
              <Trans>For best results, upload your logo in a 1:1 ratio with a transparent background.</Trans>
            }
          >
            <DashedBorder>
              <Field component={ImageUploadSlat} name="logo" hideLabel required disabled={isSaving} />
            </DashedBorder>
          </SettingsBlockMaker>

          <View paddingBottom={5}>
            <Field name="portalColor" label={i18n._(t`Portal color`)} component={ColorPicker} />
          </View>

          <SettingsBlockMaker
            title={<Trans>Featured image</Trans>}
            description={
              <Trans>
                Used in sign up and login pages. For best results, upload an image in 1:1 ratio. The image can also be
                repositioned.
              </Trans>
            }
          >
            <DashedBorder>
              <Field
                name="featuredImage"
                allowCrop
                hideLabel
                component={ImageUploader}
                height={400}
                cropConfig={{
                  aspect: FEATURED_IMAGE_RATIO,
                  onCrop: onFeaturedImageCropped,
                }}
              />
            </DashedBorder>
          </SettingsBlockMaker>
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionBrand;
