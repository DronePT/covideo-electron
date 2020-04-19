import io from 'socket.io-client';

export enum SocketEvent {
  USER_JOIN = 'join-channel',
  USER_LEAVE = 'leave-channel',
  USER_PROGRESS = 'download-progress',
  MESSAGE = 'message'
}

interface SocketMessage {
  event: string;
  data: {
    [index: string]: string | number | boolean;
  };
  error: null | string;
}

class WebSocket {
  private socket: SocketIOClient.Socket;

  private channel: string | undefined;

  private subscribedEvents: SocketEvent[] = [];

  private eventHandler: Map<string, (data: never) => void> = new Map();

  constructor() {
    this.socket = io('https://covideo.andrelabs.com');

    this.socket.on('connect', () => {
      console.log('socketio connected', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('socketio disconnected', this.socket.id);
    });

    this.socket.on('message', (message: SocketMessage) => {
      this.handleSocketEvent(message);
    });
  }

  private handleSocketEvent({ event, data, error }: SocketMessage) {
    if (error) {
      console.error(error);
      return;
    }

    console.log(event, data);

    if (this.eventHandler.has(event)) {
      const fn = this.eventHandler.get(event);

      fn?.(data as never);
    }
  }

  on<T>(eventName: SocketEvent, callback: (data: T) => void): WebSocket {
    if (!this.channel || this.isEventSubscribed(eventName)) return this;

    // this.socket.on(eventName, callback);
    this.eventHandler.set(eventName, callback);

    this.subscribedEvents.push(eventName);

    return this;
  }

  /**
   * Send an event & message to websocket server
   *
   * @template T
   * @param {SocketEvent} eventName
   * @param {T} data
   * @returns {WebSocket}
   * @memberof WebSocket
   */
  send<T extends {}>(eventName: SocketEvent, data: T): WebSocket {
    this.socket.emit(eventName, data);

    return this;
  }

  subscribe(channel: string): WebSocket {
    this.channel = channel;

    this.socket.emit('join-channel', channel);

    return this;
  }

  getSocketId() {
    return this.socket.id;
  }

  private isEventSubscribed(eventName: SocketEvent): boolean {
    return !!this.subscribedEvents.find(se => se === eventName);
  }
}

export default new WebSocket();
