import * as React from 'react';
import { Text, View, ButtonFilled, foundations } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import Layout from '@src/components/common/Layout'
import withAuth from '@src/components/common/WithAuth'

function AccessDenied(props) {
  const { currentSession: { portal } } = props

  return (
    <Layout withTopNav={true}>
      <View marginTop={5} flexDirection="column" alignItems="center" height="80vh" justifyContent="center" paddingX={4}>
        <View width={600}>
            <Text css={{ color: foundations.colors.contrast}} fontSize={6} fontWeight="semibold" fontFamily="serif" paddingBottom={4} textAlign="center">
              <Trans>Admin permissions required</Trans>
            </Text>
            <Text fontFamily="Obelisc" paddingBottom={6} textAlign="center" css={{ color: foundations.colors.default}}>
              <Trans> Please contact your Go1 administrator to get access to this page or to make changes to your portal settings.</Trans>
            </Text>  
          </View>
        <ButtonFilled color="accent" href={`https://${portal.title}/p/#/app/dashboard`}><Trans>Go to Dashboard</Trans></ButtonFilled>
      </View>  
    </Layout>
  );
}

export default withAuth(AccessDenied);
