import {
  // types
  CREATE_ROOM,
  USER_JOIN_ROOM,
  USER_LEAVE_ROOM,
  USER_DOWNLOAD_PROGRESS,
  // interfaces
  CreateRoomPayload,
  UserJoinRoomPayload,
  UserLeaveRoomPayload,
  UserDownloadProgressPayload
} from '../actions/room.actions';
import { RoomState, AppAction } from './types';
import UserEntity, { UserConnectionState } from '../../domain/User';

const initialState: RoomState = {
  id: '',
  users: [],
  name: null,
  magnetUrl: ''
};

export default function RoomReducer(
  state: RoomState = initialState,
  action: AppAction<
    | CreateRoomPayload
    | UserJoinRoomPayload
    | UserLeaveRoomPayload
    | UserDownloadProgressPayload
  >
) {
  switch (action.type) {
    case USER_DOWNLOAD_PROGRESS: {
      const {
        socketId,
        progress
      } = action.payload as UserDownloadProgressPayload;

      return {
        ...state,
        users: state.users.map(u => {
          const newUser = UserEntity.create(u);

          if (newUser.getId() === socketId) {
            newUser.setProgress(progress);
          }

          return newUser;
        })
      };
    }
    case USER_LEAVE_ROOM: {
      const { socketId } = action.payload as UserLeaveRoomPayload;

      return {
        ...state,
        users: state.users.filter(u => u.getId() !== socketId)
      };
    }
    case USER_JOIN_ROOM: {
      const { socketId, userName } = action.payload as UserJoinRoomPayload;

      return {
        ...state,
        users: [
          ...state.users,
          new UserEntity({
            id: socketId,
            name: userName,
            connectionState: UserConnectionState.CONNECTED
          })
        ]
      };
    }
    case CREATE_ROOM: {
      const { id, magnetUrl, name } = action.payload as CreateRoomPayload;

      return {
        ...state,
        id,
        name,
        magnetUrl
      };
    }
    default:
      return state;
  }
}
