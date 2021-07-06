import { Checkbox, ColorPicker as BaseColorPicker, Field, foundations, ImageUploader, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsBlockMaker from '@src/components/Settings/SettingsBlockMaker';
import { usePrevious } from '@src/hooks/usePrevious';
import { FormikHandlers } from 'formik';
import React, { FunctionComponent, useState, useEffect } from 'react';
import getConfig from 'next/config';
import { DEFAULT_LOGO, DEFAULT_LANDING_PAGE_IMAGE } from '@src/constants';
import SettingsFormSection from '../SettingsFormSection';
import { ImageSupportText } from './ImageSupportText';
import PreviewButton from './PreviewButton';
import { imageValidator } from './imageValidator';
import { ThemeSettingFormValues } from './types';
import AuthPreview from './AuthPreview';
import SignupForm from './Previews/SignupForm';

const FEATURED_IMAGE_RATIO = 1;

interface Props {
  isSaving?: boolean;
  onFeaturedImageCropped?: (image: Blob | undefined) => void;
  isPartnerPortal?: boolean;
  themeSettings: ThemeSettingFormValues;
  siteName?: string;
}

const {
  publicRuntimeConfig: { CDN_PATH },
} = getConfig();

const ColorPicker: FunctionComponent<{
  name?: string;
  value?: string;
  error?: boolean | string;
  onChange?: FormikHandlers['handleChange'];
}> = ({ name, value, error, onChange, ...props }) => (
  <BaseColorPicker
    {...props}
    color={value}
    onChange={(newColor) =>
      onChange?.({
        target: {
          name,
          value: newColor,
        },
      })
    }
  />
);

let id: number;

const SectionBrand: FunctionComponent<Props> = ({
  isSaving,
  onFeaturedImageCropped,
  isPartnerPortal,
  themeSettings,
  siteName,
}) => {
  const [allowCrop, setAllowCrop] = useState<boolean>(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [featuredImageZoomValue, setFeaturedImageZoomValue] = useState(1);
  const prevIsSaving = usePrevious(isSaving);

  // A hack way to not call the callback when component mounted
  // and right after having saved
  function setAllow2CropAfterMoment() {
    if (typeof id !== 'undefined') {
      clearTimeout(id);
      id = undefined;
    }
    id = window.setTimeout(() => setAllowCrop(true), 500);
  }

  const { logo, featuredImage, signupTitle, signupDescription, portalColor } = themeSettings;

  useEffect(setAllow2CropAfterMoment, []);

  useEffect(() => {
    // reset after having saved which means switch from `true` => `false`
    if (typeof prevIsSaving !== 'undefined' && isSaving !== prevIsSaving && !isSaving) {
      setAllowCrop(false);
      setAllow2CropAfterMoment();
      onFeaturedImageCropped(undefined);
      if (featuredImageZoomValue !== 1) {
        setFeaturedImageZoomValue(1);
      }
    }
  }, [isSaving]);

  function handleCrop(file: Blob) {
    if (allowCrop) {
      onFeaturedImageCropped(file);
    }
  }

  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Brand</Trans>}
          actionButton={
            <PreviewButton onClick={() => setOpenPreview(true)}>
              <Trans>Preview brand</Trans>
            </PreviewButton>
          }
        >
          <AuthPreview
            isOpen={openPreview}
            onRequestClose={() => setOpenPreview(false)}
            title={i18n._(t`brand`)}
            buttonText={i18n._(t`Create new account`)}
            primaryTagline={signupTitle || 'Sign up with your work email '}
            terms={<Trans>By creating an account you are agreeing to {siteName || 'the Go1'}&rsquo;s</Trans>}
            secondaryTagline={[i18n._(t`Already have an account?`), i18n._(t`Log in`)]}
            description={signupDescription}
            featuredImage={typeof featuredImage === 'string' && featuredImage}
            logo={typeof logo === 'string' && logo}
            portalColor={portalColor}
            showPolicyLinks
          >
            <SignupForm />
          </AuthPreview>

          <SettingsBlockMaker
            marginBottom={isPartnerPortal ? 0 : 5}
            title={<Trans>Logo</Trans>}
            description={
              <Trans>
                For best results, upload your logo in either JPG, PNG or GIF format with minimum dimensions of 200x200px
                over a transparent background and 5MB maximum size.
              </Trans>
            }
          >
            <Field
              component={ImageUploader}
              name="logo"
              hideLabel
              hideStatus
              required
              disableDelete={typeof logo === 'string' && logo?.includes(DEFAULT_LOGO)}
              defaultImage={DEFAULT_LOGO}
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
                Used in sign up and login pages. For best results, upload an image in either JPG, PNG or GIF format with
                at least 1000px in height and 5MB maximum size.
              </Trans>
            }
            marginBottom={0}
          >
            <Field
              id="featuredImage"
              name="featuredImage"
              allowCrop
              hideLabel
              disableDelete={typeof featuredImage === 'string' && featuredImage?.includes(DEFAULT_LANDING_PAGE_IMAGE)}
              defaultImage={DEFAULT_LANDING_PAGE_IMAGE}
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
              }}
              supportedFormatText={<ImageSupportText />}
              zoomValue={featuredImageZoomValue}
              onZoomChange={(value) => setFeaturedImageZoomValue(value)}
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
