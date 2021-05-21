import React from 'react';
import { ButtonFilled, ButtonFilledProps, Text } from '@go1d/go1d';

interface PreviewButtonProps extends ButtonFilledProps {}

const PreviewButton = ({ children, ...buttonProps }: PreviewButtonProps) => (
  <ButtonFilled display={['none', 'flex', 'flex']} {...buttonProps}>
    <Text>{children}</Text>
  </ButtonFilled>
);

export default PreviewButton;
