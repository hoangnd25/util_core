import { ButtonFilled, Field, foundations, ImageUploadSlat, Text, TextInput, View } from '@go1d/go1d';
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
          title={<Trans>Customize completion certificate</Trans>}
          actionButton={
            <ButtonFilled>
              <Text
                display={["flex", "flex", "none"]}
              >
                <Trans>Preview</Trans>
              </Text>
              <Text
                display={["none", "none", "flex"]}
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
