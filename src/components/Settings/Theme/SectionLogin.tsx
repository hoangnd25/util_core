import { Checkbox, Field, TextInput, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';
import { I18n } from '@lingui/react';
import PreviewButton from './PreviewButton';

interface Props {
  isPartnerPortal?: boolean;
}

const SectionLogin: FunctionComponent<Props> = ({ isPartnerPortal }) => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize login</Trans>}
          actionButton={<PreviewButton><Trans>Preview login</Trans></PreviewButton>}
        >
          <View marginBottom={5}>
            <Field name="loginTitle" label={i18n._(t`Login title`)} component={TextInput} hideStatus />
          </View>
          <View marginBottom={5}>
            <Field name="loginDescription" label={i18n._(t`Login description`)} component={TextInput} hideStatus />
          </View>
          {isPartnerPortal && (
            <View>
              <Field 
                name="applyCustomizationLogin" 
                label={i18n._(t`Apply login customization to customer portals`)} 
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

export default SectionLogin;
