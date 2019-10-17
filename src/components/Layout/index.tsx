import * as React from "react";
import Head from 'next/head';
import { View, Container } from '@go1d/go1d';
import WithTopNav from './withTopNav';

const Index = ({ children, title="GO1", wrappingContainer, withTopNav, containerProps } : { children: React.ReactNode, title?: string, wrappingContainer?: boolean, withTopNav?: boolean, containerProps?: any }) => {
  return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        {withTopNav && <WithTopNav />}
        {wrappingContainer === true ?
          (<Container contain="wide" minHeight={600} justifyContent="center" paddingY={5} paddingX={5} {...containerProps}>
            {children}
          </Container>)
          : {children}}
      </>
    );
};

export default Index;
