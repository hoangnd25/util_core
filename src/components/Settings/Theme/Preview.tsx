import React from 'react';
import { View, Modal, ButtonFilled } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import SplitLayout from './Previews/SplitLayout';

interface Props {
  primaryTagline: string;
  description: string;
  logo: File | string | null;
  buttonText: string;
  featuredImage: string;
  terms: string;
  secondaryTagline: string[];
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onRequestClose: () => void;
  showPolicyLinks: boolean;
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
  } = props;

  return (
    <Modal isOpen={isOpen} maxWidth={850} title={`Preview ${title}`} onRequestClose={onRequestClose}>
      <SplitLayout
        buttonText={buttonText}
        primaryTagline={primaryTagline}
        terms={terms}
        secondaryTagline={secondaryTagline}
        description={description}
        featuredImage={featuredImage}
        logo={logo}
        showPolicyLinks={showPolicyLinks}
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
