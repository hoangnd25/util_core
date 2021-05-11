import React, { ReactNode } from 'react';
import { ButtonFilled, ButtonFilledProps, Text } from '@go1d/go1d';
import { Trans } from '@lingui/macro';

interface PreviewButtonProps extends ButtonFilledProps {
  mobileChildren?: ReactNode;
}

const PreviewButton = ({ children, mobileChildren = 'Preview', ...buttonProps }: PreviewButtonProps) => (
  <ButtonFilled {...buttonProps}>
    <Text display={['flex', 'none', 'none']}>
      <Trans>{mobileChildren}</Trans>
    </Text>
    <Text display={['none', 'flex', 'flex']}>
      <Trans>{children}</Trans>
    </Text>
  </ButtonFilled>
);

export default PreviewButton;
