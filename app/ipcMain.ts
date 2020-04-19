import { IpcMain, BrowserWindow } from 'electron';
import WebTorrent from 'webtorrent';
import mime from 'mime';
import { Server } from 'http';
import throttle from 'lodash/throttle';

process.setMaxListeners(0);

const PORT = 1337;
let currentTorrent: WebTorrent.Torrent | undefined;
let currentClient: WebTorrent.Instance | undefined;
let currentServer: Server | undefined;

const destroyTorrent = (): Promise<void> =>
  new Promise((resolve, reject): void => {
    if (!currentTorrent) {
      return resolve();
    }

    return currentTorrent.destroy(err => {
      if (err) {
        reject(err);
        return;
      }

      currentTorrent = undefined;

      resolve();
    });
  });

const destroyClient = (): Promise<void> =>
  new Promise((resolve, reject): void => {
    if (!currentClient) {
      resolve();
      return;
    }

    currentClient.destroy(err => {
      if (err) {
        reject(err);
        return;
      }

      currentClient = undefined;

      resolve();
    });
  });

const destroyServer = (): Promise<void> =>
  new Promise((resolve, reject): void => {
    if (!currentServer) {
      resolve();
      return;
    }

    currentServer.close(err => {
      if (err) {
        reject(err);
        return;
      }

      currentServer = undefined;

      resolve();
    });
  });

const destroy = () => {
  return Promise.all([
    destroyTorrent(),
    destroyClient(),
    destroyServer()
  ]).catch(err => console.log(err));
};

export enum IPCEvents {
  RESIZE_WINDOW = 'RESIZE_WINDOW',
  CREATE_ROOM = 'CREATE_ROOM',
  TORRENT_DOWNLOAD = 'TORRENT_DOWNLOAD',
  START_DOWNLOAD = 'START_DOWNLOAD',
  DESTROY = 'DESTROY',
  DESTROYED = 'DESTROYED',
  URL_READY = 'URL_READY'
}

export interface ResizeData {
  width: number;
  height: number;
}

export interface CreateRoomData {
  magnetUrl: string;
}

export interface TorrentDownloadData {
  downloaded: number;
  total: number;
  progress: number;
  files?: WebTorrent.TorrentFile[];
  downloadSpeed: number;
}

export default (ipcMain: IpcMain, mainWindow: BrowserWindow | null) => {
  const getVideoFromTorrent = (
    torrent: WebTorrent.Torrent
  ): [WebTorrent.TorrentFile, number] => {
    const videoIndex = torrent.files.findIndex(file => {
      const mimeType = mime.getType(file.path)?.indexOf('video') ?? false;

      return mimeType !== false && mimeType > -1;
    });

    return [torrent.files[videoIndex], videoIndex];
  };

  ipcMain.on(IPCEvents.RESIZE_WINDOW, (_event, data: ResizeData) => {
    mainWindow?.setSize(data.width, data.height);
  });

  ipcMain.on(IPCEvents.START_DOWNLOAD, async (event, data: CreateRoomData) => {
    console.log('start download #1?');
    await destroy().catch(error => console.log('error somewhere', error));
    console.log('start download #2?');

    currentClient = new WebTorrent();

    currentClient.add(data.magnetUrl, torrent => {
      currentTorrent = torrent;
      currentServer = torrent.createServer();

      currentServer.listen(PORT, () => {
        console.log(`Torrent server: ${PORT}`);
      });

      const replyDownloadData = (): void => {
        // Get video file from files
        const [video, videoIndex] = getVideoFromTorrent(torrent);

        event.reply(IPCEvents.TORRENT_DOWNLOAD, {
          downloaded: video?.downloaded,
          progress: video ? video.downloaded / video.length : 0,
          index: videoIndex,
          name: video?.name
        });
      };

      torrent.on('download', throttle(replyDownloadData, 500));
      torrent.on('done', replyDownloadData);
      torrent.on('ready', replyDownloadData);
    });
  });

  ipcMain.on(IPCEvents.DESTROY, async event => {
    await destroy();

    event.reply(IPCEvents.DESTROYED, null);
  });
};
