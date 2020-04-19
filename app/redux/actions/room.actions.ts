// import uuid from 'uuid/v4';
import ws, { SocketEvent } from '../../infra/WebSocket';

import { Dispatch, GetState, RoomState } from '../reducers/types';
import StartDownloadEvent from '../../events/StartDownloadEvent';
import { IPCEvents } from '../../ipcMain';
import StopDownloadEvent from '../../events/StopDownloadEvent';

export const CREATE_ROOM = 'CREATE_ROOM';
export const USER_JOIN_ROOM = 'USER_JOIN_ROOM';
export const USER_LEAVE_ROOM = 'USER_LEAVE_ROOM';
export const USER_DOWNLOAD_PROGRESS = 'USER_DOWNLOAD_PROGRESS';

export function createAction<T = {}>(type: string, payload: T) {
  return {
    type,
    payload
  };
}

export interface CreateRoomPayload {
  id: string;
  name: string;
  magnetUrl: string;
}

export interface UserJoinRoomPayload {
  socketId: string;
  userName: string;
}

export interface UserLeaveRoomPayload {
  socketId: string;
}

export interface UserDownloadProgressPayload {
  socketId: string;
  progress: number;
}

export function downloadTorrent(magnetUrl?: string) {
  return (_dispatch: Dispatch<{}>, getState: GetState) => {
    // check if room exists
    const rootState = getState();

    if (!rootState.room.id) {
      console.warn('No id or magnetUrl set on state');
      return;
    }

    const magnet = magnetUrl || rootState.room.magnetUrl || null;

    if (!magnet) {
      console.warn('no magnet set!');
      return;
    }

    console.log('we should somehow start download here');
    StartDownloadEvent.create(magnet).addTorrentEventListener<{
      progress: number;
    }>(IPCEvents.TORRENT_DOWNLOAD, (_event, data) => {
      ws.send(SocketEvent.MESSAGE, {
        event: 'download-progress',
        data: { progress: Math.ceil(data.progress * 100) }
      });
    });
    // TODO - download through IPCevents?
  };
}

export function stopTorrent() {
  return (_dispatch: Dispatch<{}>, getState: GetState) => {
    // check if room exists
    const rootState = getState();

    if (!rootState.room.id) {
      console.warn('No id or magnetUrl set on state');
      return;
    }

    const magnet = rootState.room.magnetUrl || null;

    if (!magnet) {
      console.warn('no magnet set!');
      return;
    }

    StopDownloadEvent.create().addTorrentEventListener<null>(
      IPCEvents.DESTROYED,
      () => {
        ws.send(SocketEvent.MESSAGE, {
          event: 'download-stop',
          data: {}
        });
      }
    );
    // TODO - download through IPCevents?
  };
}

export function createRoom(name = '', magnetUrl: string) {
  return (
    dispatch: Dispatch<
      | CreateRoomPayload
      | UserJoinRoomPayload
      | UserLeaveRoomPayload
      | UserDownloadProgressPayload
    >
  ) => {
    // const roomId = uuid();
    const roomId = 'room-id';

    ws.subscribe(roomId)
      .on<UserJoinRoomPayload>(
        SocketEvent.USER_JOIN,
        ({ socketId, userName }) => {
          dispatch(
            createAction<UserJoinRoomPayload>(USER_JOIN_ROOM, {
              socketId,
              userName
            })
          );
        }
      )
      .on<UserLeaveRoomPayload>(SocketEvent.USER_LEAVE, ({ socketId }) => {
        dispatch(
          createAction<UserLeaveRoomPayload>(USER_LEAVE_ROOM, { socketId })
        );
      })
      .on<UserDownloadProgressPayload>(
        SocketEvent.USER_PROGRESS,
        ({ socketId, progress }) => {
          dispatch(
            createAction<UserDownloadProgressPayload>(USER_DOWNLOAD_PROGRESS, {
              socketId,
              progress
            })
          );
        }
      );

    dispatch(
      createAction<CreateRoomPayload>(CREATE_ROOM, {
        id: roomId,
        name,
        magnetUrl
      })
    );
  };
}
