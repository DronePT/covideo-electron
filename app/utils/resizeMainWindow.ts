import { ipcRenderer } from 'electron';
import { IPCEvents, ResizeData } from '../ipcMain';

export const resizeMainWindow = (width: number, height: number) => {
  const size: ResizeData = { width, height };

  console.log('entrei?!', size);

  ipcRenderer.send(IPCEvents.RESIZE_WINDOW, size);
};

export default {};
