import { Field, ImageUploadSlat, TextInput, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { FunctionComponent } from 'react';
import SettingsFormSection from '../SettingsFormSection';
import PreviewButton from './PreviewButton';

interface Props {
  isSaving?: boolean;
}

const SectionCertificate: FunctionComponent<Props> = ({ isSaving }) => {
  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize completion certificate</Trans>}
          actionButton={<PreviewButton><Trans>Preview certificate</Trans></PreviewButton>}
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
              name="signatureName" label={i18n._(t`Signature full name`)} component={TextInput} disabled={isSaving} hideStatus
            />
          </View>

          <View paddingBottom={5}>
            <Field name="signatureTitle" label={i18n._(t`Signature title`)} component={TextInput} disabled={isSaving} hideStatus />
          </View>
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionCertificate;
