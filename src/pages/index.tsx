import * as React from 'react';
import Cookies from 'universal-cookie';
import { View, Text, foundations } from '@go1d/go1d';
import { getNested } from '@go1d/mine/utils';
import FeatureToggleService from '../services/featureToggleService';
import createHttp from '../utils/http';
import Layout from '../components/Layout';

const SIDEBAR_WIDTH = 220;
const cookies = new Cookies();
const http = createHttp();

class MasterPage extends React.Component<any, any> {
  public static async getInitialProps() {
    try {
      const go1Cookies = getNested(cookies, 'cookies.go1', null);
      const featureToggles = await FeatureToggleService(http).getFeatures(go1Cookies);

      return {
        featureToggles,
      };
    } catch (e) {
      return {
        featureToggles: [],
      };
    };
  }

  getPageTitle() {
    return 'Portal settings';
  }

  getPageOptions() {
    return {
      title: true,
      sidebar: true,
      body: true,
    };
  }

  renderSidebar() {
    return (
      <Text fontWeight="semibold">Page sidebar</Text>
    );
  }

  renderBody() {
    return (
      <>
        <Text>Page content</Text>
      </>
    );
  }

  render() {
    const pageTitle = this.getPageTitle();
    const { title: hasTitle, sidebar: hasSidebar, body: hasBody } = this.getPageOptions();

    return (
      <View backgroundColor="faint">
        <Layout
          title={pageTitle}
          wrappingContainer
          withTopNav
          containerProps={{
            justifyContent: 'initial',
          }}
        >
          <View css={{
            [foundations.breakpoints.md]: {
              flexDirection: 'row',
              paddingBottom: foundations.spacing[6],
              paddingTop: foundations.spacing[6],
            },
          }}>
            {hasSidebar && (
              <View
                marginBottom={5}
                marginRight={5}
                css={{
                  [foundations.breakpoints.md]: {
                    width: SIDEBAR_WIDTH,
                  },
                }}
              >
                {this.renderSidebar()}
              </View>
            )}

            {(hasTitle || hasBody) && (
              <View flexGrow={1} flexShrink={1}>
                {hasTitle && (
                  <View marginBottom={5}>
                    <Text element="h1" fontSize={4} fontWeight="semibold">{pageTitle}</Text>
                  </View>
                )}

                {hasBody && (
                  <View backgroundColor="background" padding={5} borderRadius={2}>
                    {this.renderBody()}
                  </View>
                )}
              </View>
            )}
          </View>
        </Layout>
      </View>
    );
  }
}

export default MasterPage;
