import { View, Modal, ButtonFilled, Theme } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import { useContext } from 'react';

type DashboardPreviewProps = {
  title: string;

  isOpen: boolean;
  onRequestClose: () => void;
};

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ title, isOpen, onRequestClose, children }) => {
  const theme = useContext(Theme);

  return (
    <Modal title={`Preview ${title}`} onRequestClose={onRequestClose} isOpen={isOpen} maxWidth={850}>
      <View css={{ border: `1px solid ${theme.colors.faint}`, borderRadius: 4 }}>{children}</View>
      <View marginTop={5} display="flex" flexDirection="row" justifyContent="center">
        <ButtonFilled color="accent" onClick={onRequestClose}>
          <Trans>Close preview</Trans>
        </ButtonFilled>
      </View>
    </Modal>
  );
};
export default DashboardPreview;
