import { ipcRenderer, IpcRendererEvent } from 'electron';
import { IPCEvents } from '../ipcMain';

export default class StartDownloadEvent {
  magnetUrl: string;

  constructor(magnetUrl: string) {
    this.magnetUrl = magnetUrl;

    this.startTorrent();
  }

  addTorrentEventListener<T>(
    event: IPCEvents,
    fn: (event: IpcRendererEvent, data: T) => void
  ) {
    console.log('listening', event);
    ipcRenderer.on(event, fn);

    return this;
  }

  private startTorrent() {
    ipcRenderer.send(IPCEvents.START_DOWNLOAD, { magnetUrl: this.magnetUrl });
  }

  static create(magnetUrl: string): StartDownloadEvent {
    return new StartDownloadEvent(magnetUrl);
  }
}
