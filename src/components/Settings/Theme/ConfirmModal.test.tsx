import * as React from 'react';
import { I18nProvider } from '@lingui/react';
import { FormikProvider } from 'formik';
import { render, waitFor } from '@testing-library/react';
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
  global.URL.createObjectURL = jest.fn();
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

it('Should render without portals count', async (done) => {
  mock.onGet('/portal/test.mygo1.com?includeChildPortalsCount=1').reply(200, {});
  const { getByText, findAllByTestId } = setup({
    isOpen: true,
    portalInstance: 'test.mygo1.com',
  });

  await waitFor(async () => {
    expect(
      getByText((_, node) => {
        return (
          node.textContent === 'The following options will be applied to all customer portals. Do you want to continue?'
        );
      })
    ).toBeInTheDocument();
    expect(await findAllByTestId('customization-group')).toHaveLength(Object.keys(formValues).length);
    done();
  });
});

it('Should render with portals count', async (done) => {
  mock.onGet('/portal/test.mygo1.com?includeChildPortalsCount=1').reply(200, {
    partner_child_portals_number: 10,
  });
  const { getByText } = setup({
    isOpen: true,
    portalInstance: 'test.mygo1.com',
  });

  await waitFor(() => {
    getByText((_, node) => {
      return (
        node.textContent === 'The following options will be applied to all customer portals. Do you want to continue?'
      );
    });
    done();
  });
});
