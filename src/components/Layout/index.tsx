import * as React from "react";
import Head from 'next/head';
import { View, Container } from '@go1d/go1d';
import WithTopNav from './withTopNav';

const Index = ({ children, title="GO1", wrappingContainer, withTopNav, containerProps } : { children: React.ReactNode, title?: string, wrappingContainer?: boolean, withTopNav?: boolean, containerProps?: any }) => {

  let body = <View>{children}</View>;

  if (wrappingContainer === true) {
    body = <Container contain="wide" minHeight={600} justifyContent="center" paddingBottom={5} {...containerProps}>
      {children}
    </Container>;
  }

  return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        {withTopNav && <WithTopNav />}
        {body}
      </>
    );
};

export default Index;
