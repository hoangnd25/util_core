import * as React from "react";
import Head from 'next/head';
import { View, Container, foundations } from '@go1d/go1d';
import WithTopNav from './withTopNav';
import WithSideNav, { WithSideNavProps } from './withSideNav';

const Index = ({ children, title="GO1", wrappingContainer, withTopNav, withSideNav, containerProps } : { children: React.ReactNode, title?: string, wrappingContainer?: boolean, withTopNav?: boolean, withSideNav?: WithSideNavProps, containerProps?: any }) => {
  return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        {withTopNav && <WithTopNav />}
        {wrappingContainer === true ?
          (<Container contain="wide" minHeight={600} paddingY={5} paddingX={5} {...containerProps}>
            {withSideNav ? (
              <View css={{
                [foundations.breakpoints.md]: {
                  paddingBottom: foundations.spacing[6],
                  paddingTop: foundations.spacing[6],
                },
              }}>
                <View flexDirection={["column", "row"]} alignItems={["initial", "flex-start"]}>
                  <WithSideNav {...withSideNav} />
                  <View flexGrow={1}>{children}</View>
                </View>
              </View>
            ) : children}
          </Container>)
          : children}
      </>
    );
};

export default Index;
