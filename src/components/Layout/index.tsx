import * as React from "react";
import Head from 'next/head';
import { View, Container, Text } from '@go1d/go1d';

const Index = ({ children, title="GO1", ...restProps } : { children: React.ReactNode, title?: string }) => {
  return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <Container contain="wide" minHeight={600} justifyContent="center" paddingBottom={5} {...restProps}>
          {children}
        </Container>
      </>
    );
};

export default Index;
