import { Banner, View, Text, ButtonMinimal, foundations } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { connect } from 'react-redux';
import { mapCurrentSessionToProps } from '@src/components/common/WithAuth';
import beam from '@src/utils/tracking';
import { CurrentSessionType } from '@src/types/user';
import createHttp from '@src/utils/http';
import { PortalData, PortalService } from '@go1d/go1d-exchange/build/services/PortalService';

const http = createHttp();

interface newConfig extends PortalData {
  login_version?: string
}
export const portalService = new PortalService(http);

interface UpgradeBannerProps {
  currentSession: CurrentSessionType;
  upgradedLogin: Function;
}

const UpgradeBanner: React.FC<UpgradeBannerProps> = (props) => {
  const [showBanner, setShowBanner] = useState(false);

  const {
    currentSession: { portal, user },
  } = props;

  useEffect(() => {      
      beam.setContext({
        application: {
          repo: 'apps/go1-portal',
          page: 'settings/theme',
        },
      });
      beam.identify(user, portal);

      if (portal.configuration && portal.configuration.login_version !== 'peach') {
        setShowBanner(true);
        beam.startSession('go1-portal.loginVersion.portalNeedsToUpgrade', {});
        passUpgradedLoginStatus();
      }

    return beam.endSession();
  }, []);

  const passUpgradedLoginStatus = () => {
    props.upgradedLogin(showBanner);
  };

  const submitUpgradedStatus = () => {
    beam.track({
      type: 'go1-portal.loginVersion.submitPortalUpgrade',
    });
    portalService.updatePortal(portal.title, { 'login_version': 'peach' } as newConfig).then(() => {
      setShowBanner(false), passUpgradedLoginStatus();
      beam.endSession();
    });
  };

  return (
    <View>
      {!showBanner && (
        <Banner marginY={6} type="note" flexDirection="row" close={() => setShowBanner(false)}>
          <View flexDirection="row" width="100%">
            <View flexDirection="column" flexShrink={1}>
              <Text>
                <Trans>
                  A brand new customisable sign up experience is available to your portal. You will be automatically
                  upgraded on <Text fontWeight="bold">May 2021</Text>.
                </Trans>
              </Text>
              <ButtonMinimal
                width='fit-content'
                marginTop={4}
                border={1}
                onClick={submitUpgradedStatus}
                css={{ borderColor: foundations.colors.faded, color: foundations.colors.default }}
              >
                <Trans>Upgrade now</Trans>
              </ButtonMinimal>
            </View>
            <View flexGrow={1}>
              <Image src="/Login_banner.png" alt="Go1_login" width="224" height="164"></Image>
            </View>
          </View>
        </Banner>
      )}
    </View>
  );
};

export default connect(
  mapCurrentSessionToProps,
  null
)(UpgradeBanner);
