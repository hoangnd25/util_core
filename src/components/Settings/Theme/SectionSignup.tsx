import { ButtonFilled, Field, Text, TextInput, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';

const SectionSignup: FunctionComponent = () => {
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
              <Trans>Customize sign up</Trans>
            </Text>
          }
          actionButton={
            <ButtonFilled>
              <Text display={['flex','none','none']}>
                <Trans>Preview</Trans>
              </Text>
              <Text display={['none','flex','flex']}>
                <Trans>Preview sign up</Trans>
              </Text>
            </ButtonFilled>
          }
        >
          <View marginBottom={5}>
            <Field name="signupTitle" label={i18n._(t`Sign up title`)} component={TextInput} />
          </View>
          <View marginBottom={0}>
            <Field name="signupDescription" label={i18n._(t`Sign up description`)} component={TextInput} />
          </View>
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionSignup;
