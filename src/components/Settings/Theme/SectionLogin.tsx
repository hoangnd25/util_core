import { Field, TextInput, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';
import { I18n } from '@lingui/react';
import PreviewButton from './PreviewButton';

const SectionLogin: FunctionComponent = () => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize login</Trans>}
          actionButton={<PreviewButton><Trans>Preview login</Trans></PreviewButton>}
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
