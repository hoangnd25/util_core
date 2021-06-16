import React from 'react';
import { View, Modal, ButtonFilled } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import SplitLayout from './Previews/SplitLayout';

interface Props {
  primaryTagline: React.ReactNode;
  description: string;
  logo: File | string | null;
  buttonText: string;
  featuredImage: string;
  terms: string;
  secondaryTagline: React.ReactNode;
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onRequestClose: () => void;
  showPolicyLinks: boolean;
  portalColor: string;
}

const Preview: React.FC<Props> = (props) => {
  const {
    isOpen,
    onRequestClose,
    title,
    children,
    buttonText,
    terms,
    primaryTagline,
    secondaryTagline,
    description,
    featuredImage,
    logo,
    showPolicyLinks,
    portalColor,
  } = props;

  return (
    <Modal isOpen={isOpen} maxWidth={[0, 800, 850]} title={`Preview ${title}`} onRequestClose={onRequestClose}>
      <SplitLayout
        buttonText={buttonText}
        primaryTagline={primaryTagline}
        terms={terms}
        secondaryTagline={secondaryTagline}
        description={description}
        featuredImage={featuredImage}
        logo={logo}
        showPolicyLinks={showPolicyLinks}
        portalColor={portalColor}
      >
        {children}
      </SplitLayout>

      <View marginTop={5} display="flex" flexDirection="row" justifyContent="center">
        <ButtonFilled color="accent" onClick={onRequestClose}>
          <Trans>Close preview</Trans>
        </ButtonFilled>
      </View>
    </Modal>
  );
};

export default Preview;
