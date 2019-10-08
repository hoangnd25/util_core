import * as React from 'react';
import { ButtonFilled, View, Container, Text, UL, LI } from '@go1d/go1d';
import Link from '../components/Link';

export class IndexRedirect extends React.PureComponent {
    public render() {
      return (
        <Container contain="wide" height={600} justifyContent="center">
          <View marginBottom={5}>
            <Text element="h1" fontSize={4} fontWeight="semibold">Hello World!</Text>
          </View>
          <View backgroundColor="background" padding={5} borderRadius={2}>
            This React Base App is supposed to be a "light-weight" base, to build react apps for GO1. It is based on Next.JS 9 and supports following features out of the box:
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
            <Text element="h2" fontSize={3} fontWeight="semibold">Things to read before you start:</Text>
            <UL>
              <LI iconName="ChevronRight"><Link href="https://nextjs.org/learn/basics/getting-started" target="_blank">Next.js Getting Started</Link></LI>
              <LI iconName="ChevronRight"><Link href="https://nextjs.org/docs#dynamic-routing" target="_blank">Dynamic Routing</Link></LI>
            </UL>

          </View>
        </Container>
      );
    }
}

export default IndexRedirect;
