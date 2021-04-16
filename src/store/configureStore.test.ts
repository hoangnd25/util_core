import { CurrentSessionType } from '@src/types/user';
import axios from 'axios';
import configureStore from './configureStore';

test('should have store', () => {
  const store = configureStore(
    {
      runtime: {
        embeddedMode: false
      },
      currentSession: {} as CurrentSessionType,
    },
    {
      http: axios.create() as any,
      cookies: {},
    }
  );

  expect(store).toHaveProperty('dispatch');
  expect(store).toHaveProperty('getState');
});
