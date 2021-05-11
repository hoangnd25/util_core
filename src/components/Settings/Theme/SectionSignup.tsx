import { Field, TextInput, View } from '@go1d/go1d';
import { t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';
import PreviewButton from './PreviewButton'

const SectionSignup: FunctionComponent = () => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title="Customize sign up"
          actionButton={<PreviewButton>Preview sign up</PreviewButton>}
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
