import React from 'react';
import { View, Modal, ButtonFilled } from '@go1d/go1d';
import SplitLayout from './Previews/SplitLayout';

const Preview = (props) => {
  const {isOpen, previewType, onRequestClose, themeSettings } = props;

  return (
    <Modal isOpen={isOpen} maxWidth={850} title={`Preview ${previewType}`} onRequestClose={onRequestClose}>

      <SplitLayout themeSettings={themeSettings} previewType={previewType}/>

      <View marginTop={5} display="flex" flexDirection="row" justifyContent="center">
        <ButtonFilled color="accent" onClick={onRequestClose}>Close preview</ButtonFilled>
      </View>
    </Modal>
  )
};

export default Preview;