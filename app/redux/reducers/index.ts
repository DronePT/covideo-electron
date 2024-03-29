import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import RoomReducer from './room.reducer';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    room: RoomReducer
  });
}
