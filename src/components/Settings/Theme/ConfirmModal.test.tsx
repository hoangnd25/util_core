import * as React from 'react';
import { I18nProvider } from '@lingui/react';
import { FormikProvider } from 'formik';
import { render, waitFor, screen } from '@testing-library/react';
import AppContext from '@src/utils/appContext';
import create from '@src/utils/http';
import MockAdapter from 'axios-mock-adapter';
import ConfirmModal, { ConfirmModalProps } from './ConfirmModal';

const formValues = {
  applyCustomizationLogo: true,
  applyCustomizationPortalColor: true,
  applyCustomizationFeaturedImage: true,
  applyCustomizationCertificate: true,
  applyCustomizationDashboard: true,
  applyCustomizationLogin: true,
  applyCustomizationSignup: true,
};

let mock: MockAdapter;
const http = create();

beforeEach(() => {
  mock = new MockAdapter(http);
  window.URL.createObjectURL = jest.fn();
});

const setup = (props?: ConfirmModalProps) => {
  return render(
    <I18nProvider language="en" catalogs={{ en: { messages: {} } }}>
      <AppContext.Provider value={{ http, cookies: {} }}>
        <FormikProvider
          value={
            {
              values: formValues,
            } as any
          }
        >
          <ConfirmModal {...props} />
        </FormikProvider>
      </AppContext.Provider>
    </I18nProvider>
  );
};

it('Should render without portals count', async () => {
  mock.onGet('/portal/test.mygo1.com?includeChildPortalsCount=1').reply(200, {});
  const { findAllByTestId } = setup({
    isOpen: true,
    portalInstance: 'test.mygo1.com',
  });

  await waitFor(async () => {
    expect(await findAllByTestId('customization-group')).toHaveLength(Object.keys(formValues).length);
    expect(screen.queryByTestId('confirm-message').textContent).toBe(
      'The following options will be applied to all customer portals. Do you want to continue?'
    );
  });
});

it('Should render with 1 portal', async () => {
  mock.onGet('/portal/test.mygo1.com?includeChildPortalsCount=1').reply(200, {
    partner_child_portals_number: 1,
  });
  setup({
    isOpen: true,
    portalInstance: 'test.mygo1.com',
  });

  await waitFor(() => {
    expect(screen.queryByTestId('confirm-message').textContent).toBe(
      'The following options will be applied to 1 customer portal. Do you want to continue?'
    );
  });
});

it('Should render with portals count', async () => {
  mock.onGet('/portal/test.mygo1.com?includeChildPortalsCount=1').reply(200, {
    partner_child_portals_number: 10,
  });
  setup({
    isOpen: true,
    portalInstance: 'test.mygo1.com',
  });

  await waitFor(() => {
    expect(screen.queryByTestId('confirm-message').textContent).toBe(
      'The following options will be applied to all 10 customer portals. Do you want to continue?'
    );
  });
});
