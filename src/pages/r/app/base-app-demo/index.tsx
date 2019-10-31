import * as React from 'react';
import { ButtonFilled, View, Container, Text, UL, LI } from '@go1d/go1d';
import Link from '@src/components/common/Link';
import Layout from '@src/components/common/Layout';

class Index extends React.Component {
  public render() {
    return (
      <Layout title="GO1 React Base App" wrappingContainer>
        <View marginBottom={5}>
          <Text element="h1" fontSize={4} fontWeight="semibold">Hello World!</Text>
        </View>
        <View backgroundColor="background" padding={5} borderRadius={2}>
          This React Base App is supposed to be a &quot;light-weight&quot; base, to build react apps for GO1. It is based on Next.JS 9 and supports following features out of the box:
          <View>
            <UL>
              <LI>Server Side Rendering</LI>
              <LI>User Authentication via cookies, localstorage and one time login tokens</LI>
              <LI>Portal config: Theme Color and Logo will be provided to the @go1d/provider</LI>
              <LI>IE11 Support</LI>
              <LI>Testing</LI>
              <LI>Linting</LI>
            </UL>
          </View>

          <Text element="h2" fontSize={3} fontWeight="semibold">Example usages:</Text>
          <UL>
            <LI iconName="ChevronRight"><Link module="base-app-demo" href="/examples/protectedRoute">Protected Route Example</Link></LI>
            <LI iconName="ChevronRight"><Link module="base-app-demo" href="/examples/withGo1Nav">Example with GO1 TopNav</Link></LI>
            <LI iconName="ChevronRight"><Link module="base-app-demo" href="/examples/linkComponent">Example usage of the new LinkComponent</Link></LI>
          </UL>

          <Text element="h2" fontSize={3} fontWeight="semibold">Things to read before you start:</Text>
          <UL>
            <LI iconName="ChevronRight"><Link href="https://nextjs.org/learn/basics/getting-started" target="_blank">Next.js Getting Started</Link></LI>
            <LI iconName="ChevronRight"><Link href="https://nextjs.org/docs#dynamic-routing" target="_blank">Dynamic Routing</Link></LI>
            <LI iconName="ChevronRight"><Link href="https://arunoda.me/blog/ssr-and-server-only-modules" target="_blank">Bundle size: SSR and Server Only Modules</Link></LI>
          </UL>

        </View>
      </Layout>
    );
  }
}

export default Index;
