import { ButtonFilled } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';

const SectionLogin: FunctionComponent = () => {
  return (
    <SettingsFormSection
      title={<Trans>Customize login</Trans>}
      actionButton={
        <ButtonFilled>
          <Trans>Preview login</Trans>
        </ButtonFilled>
      }
    />
  );
};

export default SectionLogin;
