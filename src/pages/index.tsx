import * as React from 'react';
import { View, Text, foundations, Skeleton } from '@go1d/go1d';
import Layout from '@src/components/common/Layout';

class MasterPage extends React.Component<any, any> {
  pageContentRef: any;

  constructor(props) {
    super(props);
    this.pageContentRef = React.createRef();
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

  scrollToTop() {
    if (this.pageContentRef && this.pageContentRef.scrollIntoView) {
      this.pageContentRef.scrollIntoView();
    }
  }

  renderSidebar() {
    return (
      <>
        <Skeleton backgroundColor="soft" height={foundations.spacing[6]} marginBottom={5} />
        <Skeleton backgroundColor="soft" height={foundations.spacing[6]} marginBottom={5} />
        <Skeleton backgroundColor="soft" height={foundations.spacing[6]} marginBottom={5} />
      </>
    );
  }

  renderBody() {
    return (
      <>
        <Skeleton backgroundColor="faint" height={foundations.spacing[6]} marginBottom={5} />
        <Skeleton backgroundColor="faint" height={foundations.spacing[6]} marginBottom={5} />
        <Skeleton backgroundColor="faint" height={foundations.spacing[6]} marginBottom={5} />
        <Skeleton backgroundColor="faint" height={foundations.spacing[6]} marginBottom={5} />
        <Skeleton backgroundColor="faint" height={foundations.spacing[6]} marginBottom={5} />
        <Skeleton backgroundColor="faint" height={foundations.spacing[6]} marginBottom={5} />
      </>
    );
  }

  render() {
    const pageTitle = this.getPageTitle();
    const { title: hasTitle, sidebar: hasSidebar, body: hasBody } = this.getPageOptions();

    return (
      <View backgroundColor="faint" minHeight="100vh" innerRef={element => {this.pageContentRef = element;}}>
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
                css={{
                  [foundations.breakpoints.md]: {
                    marginRight: foundations.spacing[5],
                    width: 220,
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
                  <View
                    backgroundColor="background"
                    boxShadow="crisp"
                    paddingX={4}
                    paddingY={5}
                    borderRadius={2}
                    css={{
                      [foundations.breakpoints.md]: {
                        padding: foundations.spacing[5],
                      },
                      [foundations.breakpoints.lg]: {
                        padding: foundations.spacing[6],
                      },
                    }}
                  >
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
