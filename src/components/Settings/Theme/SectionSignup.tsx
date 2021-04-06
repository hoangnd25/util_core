import { ButtonFilled } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';

const SectionSignup: FunctionComponent = () => {
  return (
    <SettingsFormSection
      title={<Trans>Customize sign up</Trans>}
      actionButton={
        <ButtonFilled>
          <Trans>Preview sign up</Trans>
        </ButtonFilled>
      }
    />
  );
};

export default SectionSignup;
