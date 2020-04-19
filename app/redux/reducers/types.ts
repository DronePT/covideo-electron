import {
  Dispatch as ReduxDispatch,
  Store as ReduxStore,
  Action,
  AnyAction,
  Reducer
} from 'redux';
import { RouterState } from 'connected-react-router';
import UserEntity from '../../domain/User';

export interface RoomState {
  id: string;
  name: string | null;
  magnetUrl: string;
  users: UserEntity[];
}

export type AppRootState = {
  router: Reducer<RouterState<History>>;
  room: RoomState;
};

export interface AppAction<T> extends Action<string> {
  payload: T;
}

export type GetState = () => AppRootState;

export type Dispatch<T> = ReduxDispatch<AppAction<T>>;

export type Store = ReduxStore<AppRootState, AnyAction>;
