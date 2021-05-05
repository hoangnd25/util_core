import { ButtonFilled, Field, Text, TextInput, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';
import { I18n } from '@lingui/react';

const SectionLogin: FunctionComponent = () => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={
            <Text 
              fontSize={[3]}
              display='flex'
              paddingRight={[3]}
              >
              <Trans>Customize login</Trans>
            </Text>
          }
          actionButton={
            <ButtonFilled>
              <Text display={['flex','none','none']} >
                <Trans>Preview</Trans>
              </Text>
              <Text display={['none','flex','flex']}>
                <Trans>Preview login</Trans>
              </Text>
            </ButtonFilled>
          }
        >
          <View marginBottom={5}>
            <Field name="loginTitle" label={i18n._(t`Login title`)} component={TextInput} />
          </View>
          <View marginBottom={0}>
            <Field name="loginDescription" label={i18n._(t`Login description`)} component={TextInput} />
          </View>
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionLogin;
