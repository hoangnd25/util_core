import { Checkbox, Field, ImageUploader, TextInput, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { FunctionComponent } from 'react';
import SettingsBlockMaker from '../SettingsBlockMaker';
import SettingsFormSection from '../SettingsFormSection';
import { ImageSupportText } from './ImageSupportText';
import PreviewButton from './PreviewButton';
import { imageValidator } from './imageValidator';

interface Props {
  isSaving?: boolean;
  isPartnerPortal?: boolean;
}

const SectionCertificate: FunctionComponent<Props> = ({ isSaving, isPartnerPortal }) => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize completion certificate</Trans>}
          // Will allow actionButton once the Preview Certificate is developed
          // actionButton={
          //   <PreviewButton>
          //     <Trans>Preview certificate</Trans>
          //   </PreviewButton>
          // }
        >
          <SettingsBlockMaker
            paddingBottom={5}
            title={<Trans>Signature</Trans>}
            description={
              <Trans>
                For best results, upload an image with minimum dimensions of 100x100px over a transparent or white
                background.
              </Trans>
            }
          >
            <Field
              component={ImageUploader}
              name="signatureImage"
              hideLabel
              required
              disabled={isSaving}
              height={200}
              maxWidth={200}
              imageBackgroundSize="contain"
              validate={imageValidator({
                maxSizeInMb: 5,
                minWidthInPixel: 100,
                minHeightInPixel: 100,
                minDimensionsMessage: i18n._(t`Please upload an image with minimum dimensions of 100x100px`),
                maxSizeMessage: i18n._(t`Please upload an image less than 5MB`),
              })}
              supportedFormatText={<ImageSupportText />}
            />
          </SettingsBlockMaker>

          <View paddingBottom={5}>
            <Field
              name="signatureName"
              label={i18n._(t`Signature full name`)}
              component={TextInput}
              disabled={isSaving}
              hideStatus
            />
          </View>

          <View paddingBottom={0}>
            <Field
              name="signatureTitle"
              label={i18n._(t`Signature title`)}
              component={TextInput}
              disabled={isSaving}
              hideStatus
            />
          </View>

          {isPartnerPortal && (
            <View>
              <Field
                name="applyCustomizationCertificate"
                label={i18n._(t`Apply completion certificate customization to customer portals`)}
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

export default SectionCertificate;
