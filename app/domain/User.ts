import Entity from './Entity';

export enum UserConnectionState {
  DISCONNECTED,
  CONNECTED
}

export interface User {
  id: string;
  name: string;
  magnet?: string;
  progress?: number;
  connectionState?: UserConnectionState;
}

export default class UserEntity extends Entity<User> {
  constructor(state: User) {
    super(state);

    if (!state.connectionState) {
      this.setConnectionState(UserConnectionState.DISCONNECTED);
    }
  }

  getName() {
    return this.state.name;
  }

  getProgress(): number {
    return this.state.progress || 0;
  }

  setProgress(value: number) {
    this.state.progress = parseInt(value.toString(), 10);
  }

  private setConnectionState(state: UserConnectionState) {
    this.state.connectionState = state;
  }

  static create(user: UserEntity) {
    const state = user.getState();

    return new UserEntity(state);
  }
}
