import { ButtonFilled, Field, RichTextInput, View, Text, RadioGroup, ImageUploader, ImageUploadSlat } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';
import SettingsBlockMaker from '../SettingsBlockMaker';

const SectionDashboard: FunctionComponent = () => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize dashboard</Trans>}
          actionButton={
            <ButtonFilled>
              <Trans>Preview dashboard</Trans>
            </ButtonFilled>
          }
        >
          <View marginBottom={5}>
            <Field name="dashboardWelcomeMessage" label={i18n._(t`Welcome message`)} component={RichTextInput} />
          </View>

          <SettingsBlockMaker
            marginBottom={5}
            title={<Trans>Dashboard image</Trans>}
            description={
              <Trans>
                To make your dashboard look the best you should upload a panoramic image. The following file types are
                supported PNG, JPG, GIF and max file size is 5MB.
              </Trans>
            }
          >
            <Field
              component={ImageUploader}
              name="dashboardImage"
              hideLabel
              supportedFormatText={
                <View alignItems="center">
                  <Text marginBottom={3} paddingX={4}>
                    <Trans>jpg, png and gif are supported</Trans>
                  </Text>
                  <View alignItems="flex-start" paddingX={4}>
                    <Text fontSize={1} marginBottom={1}>
                      <Trans>・Scale to fit width (Ideally a landscape image at least 1920px in width)</Trans>
                    </Text>
                    <Text fontSize={1}>
                      <Trans>・Scale to fit height (Ideally a landscape image at least 300px in height)</Trans>
                    </Text>
                  </View>
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
            <Field component={ImageUploadSlat} name="dashboardIcon" label={i18n._(t`Dashboard icon`)} />
          </View>
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionDashboard;
