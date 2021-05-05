import { ButtonFilled, Field, ImageUploadSlat, Text, TextInput, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { FunctionComponent } from 'react';
import SettingsFormSection from '../SettingsFormSection';

interface Props {
  isSaving?: boolean;
}

const SectionCertificate: FunctionComponent<Props> = ({ isSaving }) => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={
            <Text 
              fontSize={[3]} 
              display={['flex','flex','flex']} 
              paddingRight={[3]}
            >
              <Trans>Customize completion certificate</Trans>
            </Text>
          
          }
          actionButton={
            <ButtonFilled>
              <Text
                display={["flex", "none", "none"]}
              >
                <Trans>Preview</Trans>
              </Text>
              <Text
                display={["none", "flex", "flex"]}
              >
                <Trans>Preview certificate</Trans>
              </Text>
            </ButtonFilled>
          }
        >
          <View paddingBottom={5}>
            <Field
              component={ImageUploadSlat}
              name="signatureImage"
              label={i18n._(t`Signature`)}
              required
              disabled={isSaving}
            />
          </View>

          <View paddingBottom={5}>
            <Field
              name="signatureName"
              label={i18n._(t`Signature full name`)}
              component={TextInput}
              disabled={isSaving}
            />
          </View>

          <View paddingBottom={5}>
            <Field name="signatureTitle" label={i18n._(t`Signature title`)} component={TextInput} disabled={isSaving} />
          </View>
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionCertificate;
