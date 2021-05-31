import { Field, TextInput, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsFormSection, { Props } from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';
import PreviewButton from '@src/components/Settings/Theme/PreviewButton';

interface SectionSignupProps {
  sendPreviewType?: any
};

const SectionSignup: FunctionComponent<SectionSignupProps> = (props: any) => {
  
  const onClickPreview = (event) => {
    (props as any).sendPreviewType("sign up")
    event.preventDefault();
}

  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize sign up</Trans>}
          actionButton={<PreviewButton onClick={onClickPreview}><Trans>Preview sign up</Trans></PreviewButton>}
        >
          <View marginBottom={5}>
            <Field name="signupTitle" label={i18n._(t`Sign up title`)} component={TextInput} hideStatus />
          </View>
          <View marginBottom={0}>
            <Field name="signupDescription" label={i18n._(t`Sign up description`)} component={TextInput} hideStatus />
          </View>
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionSignup;
