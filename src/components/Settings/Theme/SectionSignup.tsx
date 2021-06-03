import { Checkbox, Field, TextInput, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';
import PreviewButton from './PreviewButton'

interface Props {
  isPartnerPortal?: boolean;
}

const SectionSignup: FunctionComponent<Props> = ({ isPartnerPortal }) => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize sign up</Trans>}
          actionButton={<PreviewButton><Trans>Preview sign up</Trans></PreviewButton>}
        >
          <View marginBottom={5}>
            <Field name="signupTitle" label={i18n._(t`Sign up title`)} component={TextInput} hideStatus />
          </View>
          <View marginBottom={5}>
            <Field name="signupDescription" label={i18n._(t`Sign up description`)} component={TextInput} hideStatus />
          </View>
          
          {isPartnerPortal && (
            <View>
              <Field 
                name="applyCustomizationSignup" 
                label={i18n._(t`Apply sign up customization to customer portals`)} 
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

export default SectionSignup;
