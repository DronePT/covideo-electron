import { ipcRenderer, IpcRendererEvent } from 'electron';
import { IPCEvents } from '../ipcMain';

export default class StopDownloadEvent {
  constructor() {
    this.stopTorrent();
  }

  addTorrentEventListener<T>(
    event: IPCEvents,
    fn: (event: IpcRendererEvent, data: T) => void
  ) {
    ipcRenderer.on(event, fn);

    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  private stopTorrent() {
    ipcRenderer.send(IPCEvents.DESTROY, null);
  }

  static create(): StopDownloadEvent {
    return new StopDownloadEvent();
  }
}
