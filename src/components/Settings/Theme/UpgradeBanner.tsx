import { Banner, View, Text, ButtonMinimal, foundations } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import PortalService from '@src/services/portalService';
import { connect } from 'react-redux';
import { mapCurrentSessionToProps } from '@src/components/common/WithAuth';
import beam from '@src/utils/tracking';

export const portalService = PortalService();
const UpgradeBanner = props => {
  const [showBanner, setShowBanner] = useState(false);

  const {
    currentSession: { portal, user },
  } = props;

  useEffect(() => {
    portalService.fetchPortalConfig(portal.title).then(resp => {
      beam.setContext({
        application: {
          repo: 'apps/go1-portal',
          page: 'settings/theme',
        },
      });
      beam.identify(user, portal);

      if (resp.configuration?.login_version !== 'peach') {
        setShowBanner(true);
        beam.startSession('go1-portal.loginVersion.portalNeedsToUpgrade', {});
        passUpgradedLoginStatus();
      }
    }),
      () => {
        beam.endSession();
      };
  }, []);

  const passUpgradedLoginStatus = () => {
    props.upgradedLogin(showBanner);
  };

  const submitUpgradedStatus = () => {
    beam.track({
      type: 'go1-portal.loginVersion.submitPortalUpgrade',
    });
    portalService.savePortalConfig(portal.title, { 'configuration.login_version': 'peach' }).then(() => {
      setShowBanner(false), passUpgradedLoginStatus();
      beam.endSession();
    });
  };

  return (
    <View>
      {showBanner && (
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
                marginTop={4}
                width="fit-content"
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

export default connect(mapCurrentSessionToProps, null)(UpgradeBanner);
