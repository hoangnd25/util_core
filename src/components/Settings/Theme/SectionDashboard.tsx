import { Field, RichTextInput, View, Text, RadioGroup, ImageUploader, ImageUploadSlat } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';
import SettingsBlockMaker from '../SettingsBlockMaker';
import PreviewButton from './PreviewButton';

const SectionDashboard: FunctionComponent = () => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize dashboard</Trans>}
          actionButton={<PreviewButton><Trans>Preview dashboard</Trans></PreviewButton>}
        >
          <View marginBottom={5}>
            <Field name="dashboardWelcomeMessage" label={i18n._(t`Welcome message`)} component={RichTextInput} hideStatus />
          </View>

          <SettingsBlockMaker
            marginBottom={5}
            title={<Trans>Dashboard image</Trans>}
            description={
              <Trans>To ensure you get the best result, we suggest using a panoramic image.</Trans>
            }
          >
            <Field
              component={ImageUploader}
              name="dashboardImage"
              hideLabel
              supportedFormatText={
                <View alignItems="center" textAlign="center">
                  <Text marginTop={4} marginBottom={2} paddingX={4} fontSize={[1, 2]} text>
                    <Trans>Minimum dimensions of 1920px (W) and 300px (H)</Trans>
                  </Text>
                  <Text paddingX={4} fontSize={[1, 2]}>
                    <Trans>Max file size is 5MB</Trans>
                  </Text>
                </View>
              }
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

          <View marginBottom={0}>
            <Field component={ImageUploadSlat} name="dashboardIcon" label={i18n._(t`Dashboard icon`)} hideStatus />
          </View>
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionDashboard;
