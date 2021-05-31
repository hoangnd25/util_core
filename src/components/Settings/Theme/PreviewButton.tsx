import React from 'react';
import { ButtonFilled, ButtonFilledProps, Text } from '@go1d/go1d';

interface PreviewButtonProps extends ButtonFilledProps {}

const PreviewButton = ({ children, onClick, props, ...buttonProps }: PreviewButtonProps) => {
  
  return (
    <ButtonFilled display={['none', 'flex', 'flex']} onClick={onClick} {...buttonProps}>
      <Text>{children}</Text>
    </ButtonFilled>
  );
};

export default PreviewButton;
