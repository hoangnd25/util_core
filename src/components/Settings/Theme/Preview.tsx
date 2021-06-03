import React from 'react';
import { View, Modal, ButtonFilled } from '@go1d/go1d';
import SplitLayout from './Previews/SplitLayout';

const Preview = (props) => {
  const {isOpen, onRequestClose, title, children, buttonText, terms, primaryTagline, secondaryTagline, description, featuredImage, logo } = props;

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
        >
        {children}
      </SplitLayout>
      <View marginTop={5} display="flex" flexDirection="row" justifyContent="center">
        <ButtonFilled color="accent" onClick={onRequestClose}>Close preview</ButtonFilled>
      </View>
    </Modal>
  )
};

export default Preview;