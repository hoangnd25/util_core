import { AnyAction, Store } from 'redux';
import { ResolveContext } from 'universal-router';
import { AppThunkDispatch } from '../src/store/configureStore';
import { ReduxState } from './reducers';

export interface RouteContext extends ResolveContext {
  insertCss: (
    ...styles: Array<{
      _getCss: () => {};
      _insertCss: () => () => void;
    }>
  ) => void;
  store: Store<ReduxState, AnyAction> & {
    dispatch: AppThunkDispatch;
  };
}
