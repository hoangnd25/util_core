import React from "react";
import { Text } from '@go1d/go1d';

interface BlockMakerProps {
  title: React.ReactNode
  description: React.ReactNode
}

export const ThemeBlockMaker: React.FunctionComponent<BlockMakerProps> = ({ title, description, children }) => {
  return (
    <>
      <Text element="h2" fontSize={2} fontWeight="medium" marginBottom={3}>
        {title}
      </Text>

      <Text marginBottom={3} color="subtle">
        {description}
      </Text>

      {children}
    </>
  )
}
