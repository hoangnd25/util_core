import { Field, RichTextInput, View, RadioGroup, ImageUploader, Checkbox } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';
import SettingsBlockMaker from '../SettingsBlockMaker';
import { ImageSupportText } from './ImageSupportText';
import PreviewButton from './PreviewButton';
import { imageValidator } from './imageValidator';

interface Props {
  isPartnerPortal?: boolean;
}

const SectionDashboard: FunctionComponent<Props> = ({ isPartnerPortal }) => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize dashboard</Trans>}
          actionButton={
            <PreviewButton>
              <Trans>Preview dashboard</Trans>
            </PreviewButton>
          }
        >
          <View marginBottom={5}>
            <Field
              name="dashboardWelcomeMessage"
              label={i18n._(t`Welcome message`)}
              component={RichTextInput}
              hideStatus
            />
          </View>

          <SettingsBlockMaker
            marginBottom={5}
            title={<Trans>Dashboard image</Trans>}
            description={
              <Trans>
                Used as the featured image in your dashboard. For best results, upload an image with minimum dimensions
                of 1920x300px.
              </Trans>
            }
          >
            <Field
              component={ImageUploader}
              name="dashboardImage"
              hideLabel
              validate={imageValidator({
                maxSizeInMb: 5,
                minWidthInPixel: 1920,
                minHeightInPixel: 300,
                minDimensionsMessage: i18n._(t`Please use an image with minimum dimensions of 1920x300px`),
              })}
              supportedFormatText={<ImageSupportText />}
            />
          </SettingsBlockMaker>

          <View marginBottom={5}>
            <Field
              name="dashboardImageScale"
              hideLabel
              component={RadioGroup}
              flexDirection="row"
              justifyContent="space-between"
              flexWrap="wrap"
              maxWidth={340}
              options={[
                {
                  label: i18n._(t`Scale to fit width`),
                  value: 'fixed-width',
                },
                {
                  label: i18n._(t`Scale to fit height`),
                  value: 'fixed-height',
                },
              ]}
            />
          </View>

          <SettingsBlockMaker
            marginBottom={0}
            title={<Trans>Dashboard icon</Trans>}
            description={
              <Trans>
                Used as the logo in your dashboard. For best results, upload an image with minimum dimensions of
                100x100px over a transparent background.
              </Trans>
            }
          >
            <Field
              component={ImageUploader}
              name="dashboardIcon"
              hideLabel
              hideStatus
              height={200}
              maxWidth={200}
              imageBackgroundSize="contain"
              validate={imageValidator({
                maxSizeInMb: 5,
                minWidthInPixel: 100,
                minHeightInPixel: 100,
                minDimensionsMessage: i18n._(t`Please use an image with minimum dimensions of 100x100px`),
              })}
              supportedFormatText={<ImageSupportText />}
            />
          </SettingsBlockMaker>
          {isPartnerPortal && (
            <View>
              <Field
                name="applyCustomizationDashboard"
                label={i18n._(t`Apply dashboard customization to customer portals`)}
                description={i18n._(t`This can be changed from the individual portal’s settings page`)}
                hideStatus
                component={Checkbox}
                hideLabel={true}
              />
            </View>
          )}
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionDashboard;
