import { Checkbox, ColorPicker as BaseColorPicker, Field, foundations, ImageUploader, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsBlockMaker from '@src/components/Settings/SettingsBlockMaker';
import { usePrevious } from '@src/hooks/usePrevious';
import { FormikHandlers } from 'formik';
import React, { FunctionComponent } from 'react';
import SettingsFormSection from '../SettingsFormSection';
import { ImageSupportText } from './ImageSupportText';
import PreviewButton from './PreviewButton';
import { imageValidator } from './imageValidator';

const FEATURED_IMAGE_RATIO = 1;

interface Props {
  isSaving?: boolean;
  onFeaturedImageCropped?: (image: Blob | undefined) => void;
  isPartnerPortal?: boolean;
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
    onChange={newColor =>
      onChange?.({
        target: {
          name,
          value: newColor,
        },
      })
    }
  />
);

const SectionBrand: FunctionComponent<Props> = ({ isSaving, onFeaturedImageCropped, isPartnerPortal }) => {
  const [hasInteracted, setHasInteracted] = React.useState<boolean>(false);
  const prevIsSaving = usePrevious(isSaving);

  React.useEffect(() => {
    // reset after having saved which means switch from `true` => `false`
    if (typeof prevIsSaving !== 'undefined' && isSaving !== prevIsSaving && !isSaving) {
      setHasInteracted(false);
      onFeaturedImageCropped(undefined);
    }
  }, [isSaving]);

  function handleInteractionStart() {
    setHasInteracted(true);
  }

  function handleCrop(file: Blob) {
    if (hasInteracted) {
      onFeaturedImageCropped(file);
    }
  }
  
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Brand</Trans>}
          actionButton={<PreviewButton><Trans>Preview brand</Trans></PreviewButton>}
        >
          <SettingsBlockMaker
            marginBottom={isPartnerPortal ? 0: 5}
            title={<Trans>Logo</Trans>}
            description={
              <Trans>For best results, upload your logo with minimum dimensions of 200x200px over a transparent background.</Trans>
            }
          >
            <Field
              component={ImageUploader}
              name="logo"
              hideLabel
              hideStatus
              required
              disabled={isSaving}
              imageBackgroundSize="contain"
              validate={imageValidator({
                maxSizeInMb: 5,
                minWidthInPixel: 200,
                minHeightInPixel: 200,
                minDimensionsMessage: i18n._(t`Please upload an image with minimum dimensions of 200x200px`),
                maxSizeMessage: i18n._(t`Please upload an image less than 5MB`),
              })}
              height={200}
              maxWidth={200}
              supportedFormatText={<ImageSupportText />}
            />
          </SettingsBlockMaker>

          {isPartnerPortal && (
            <View marginBottom={6}>
              <Field 
                name="applyCustomizationLogo" 
                label={i18n._(t`Apply logo to customer portals`)} 
                description={i18n._(t`This can be changed from the individual portal’s settings page`)}
                hideStatus
                component={Checkbox}
                hideLabel
              />
            </View>
          )}

          <View paddingBottom={5}>
            <Field name="portalColor" label={i18n._(t`Portal color`)} component={ColorPicker} hideStatus />
          </View>

          {isPartnerPortal && (
            <View marginBottom={6}>
              <Field 
                name="applyCustomizationPortalColor" 
                label={i18n._(t`Apply portal color to customer portals`)} 
                description={i18n._(t`This can be changed from the individual portal’s settings page`)}
                hideStatus
                component={Checkbox}
                hideLabel
              />
            </View>
          )}

          <SettingsBlockMaker
            title={<Trans>Featured image</Trans>}
            description={
              <Trans>
                Used in sign up and login pages. For best results, upload an image with at least 1000px in height.
                The image can be repositioned to fit the intended 1:1 ratio.
              </Trans>
            }
            marginBottom={0}
          >
            <Field
              id="featuredImage"
              name="featuredImage"
              allowCrop
              hideLabel
              component={ImageUploader}
              validate={imageValidator({
                maxSizeInMb: 5,
                minHeightInPixel: 1000,
                minHeightMessage: i18n._(t`Please upload an image with at least 1000px in height`),
                maxSizeMessage: i18n._(t`Please upload an image less than 5MB`),
              })}
              height={400}
              maxWidth={400}
              css={{
                [foundations.breakpoints.sm]: {
                  height: 200,
                  maxWidth: 200,
                },
              }}
              cropConfig={{
                aspect: FEATURED_IMAGE_RATIO,
                onCrop: handleCrop,
                onInteractionStart: handleInteractionStart,
              }}
              supportedFormatText={<ImageSupportText />}
            />
          </SettingsBlockMaker>

          {isPartnerPortal && (
            <View>
              <Field 
                name="applyCustomizationFeaturedImage" 
                label={i18n._(t`Apply featured image to customer portals`)} 
                description={i18n._(t`This can be changed from the individual portal’s settings page`)}
                hideStatus
                component={Checkbox}
                hideLabel
              />
            </View>
          )}
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionBrand;
