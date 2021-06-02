import React from 'react';
import { View, Modal, ButtonFilled } from '@go1d/go1d';

const Preview = (props) => {
  const {isOpen, onRequestClose, title, children } = props;

  return (
    <Modal isOpen={isOpen} maxWidth={850} title={`Preview ${title}`} onRequestClose={onRequestClose}>
        {children}
      <View marginTop={5} display="flex" flexDirection="row" justifyContent="center">
        <ButtonFilled color="accent" onClick={onRequestClose}>Close preview</ButtonFilled>
      </View>
    </Modal>
  )
};

export default Preview;