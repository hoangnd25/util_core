import { ButtonFilled, Modal, Text, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import createPortalService from '@src/services/portalService';
import AppContext from '@src/utils/appContext';
import { connect, FormikContext } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { getCustomizationGroupsFromValues } from './formHelper';

export interface ConfirmModalProps {
  portalInstance: string;
  isOpen?: boolean;
  onRequestClose?: () => void;
  onConfirm?: () => void;
}

const TranslatedGroup = ({ children }: { children: string }) => (
  <>
    {children === 'logo' && <Trans>Logo</Trans>}
    {children === 'portal_color' && <Trans>Portal color</Trans>}
    {children === 'featured_image' && <Trans>Featured image</Trans>}
    {children === 'certificate' && <Trans>Certificate customization</Trans>}
    {children === 'dashboard' && <Trans>Dashboard customization</Trans>}
    {children === 'signup' && <Trans>Signup customization</Trans>}
    {children === 'login' && <Trans>Login customization</Trans>}
  </>
);

const ConfirmModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  formik,
  portalInstance,
}: ConfirmModalProps & { formik: FormikContext<any> }) => {
  const [childPortalsCount, setChildPortalsCount] = useState<number | undefined>();
  const { http } = useContext(AppContext);

  useEffect(() => {
    if (isOpen) {
      const portalService = createPortalService(http);
      portalService.getChildPortalsCount(portalInstance).then(setChildPortalsCount);
    }
  }, [isOpen]);

  const selectedGroups = getCustomizationGroupsFromValues(formik.values);
  return (
    <I18n>
      {({ i18n }) => (
        <Modal isOpen={isOpen} title={i18n._(t`Confirm changes`)} onRequestClose={onRequestClose}>
          <View flexGrow={1} justifyContent="space-between">
            <View data-testid="confirm-message" element="p" display="inline">
              <Text display="inline">
                <Trans>The following options will be applied to all</Trans>{' '}
              </Text>
              <Text display="inline" fontWeight="semibold">
                {childPortalsCount ? `${childPortalsCount} ` : ''}
                <Trans>customer portals</Trans>
              </Text>
              <Text display="inline">
                . 
                <Trans>Do you want to continue?</Trans>
              </Text>
            </View>
            <View element="ul" marginTop={4}>
              {selectedGroups.map((group) => (
                <Text key={group} element="li" marginLeft={2} marginBottom={4} data-testid="customization-group">
                  • <TranslatedGroup>{group}</TranslatedGroup>
                </Text>
              ))}
            </View>
            <View marginTop={3} flexDirection="row" justifyContent="center">
              <ButtonFilled color="accent" marginRight={5} onClick={onConfirm} data-tid="Portal.Settings.Confirm">
                <Trans>Apply to all portals</Trans>
              </ButtonFilled>
              <ButtonFilled onClick={onRequestClose}>Cancel</ButtonFilled>
            </View>
          </View>
        </Modal>
      )}
    </I18n>
  );
};

export default connect<ConfirmModalProps>(ConfirmModal);
