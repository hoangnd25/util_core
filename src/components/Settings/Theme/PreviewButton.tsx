import React, { ReactNode } from 'react';
import { ButtonFilled, ButtonFilledProps, Text } from '@go1d/go1d';
import { Trans } from '@lingui/macro';

interface PreviewButtonProps extends ButtonFilledProps {
  mobileChildren?: ReactNode;
}

const PreviewButton = ({ children, mobileChildren = <Trans>Preview</Trans>, ...buttonProps }: PreviewButtonProps) => (
  <ButtonFilled {...buttonProps}>
    <Text display={['flex', 'none', 'none']}>{mobileChildren}</Text>
    <Text display={['none', 'flex', 'flex']}>{children}</Text>
  </ButtonFilled>
);

export default PreviewButton;
