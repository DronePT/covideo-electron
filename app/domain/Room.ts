import uuid from 'uuid/v4';
import Entity from './Entity';
import UserEntity from './User';

export interface Room {
  id: string;
  name: string | null;
  magnetUrl: string;
  users: UserEntity[];
}

export default class RoomEntity extends Entity<Room> {
  constructor(magnetUrl: string) {
    super({
      id: uuid(),
      name: null,
      users: [],
      magnetUrl
    });
  }

  setName(name: string) {
    this.state.name = name;
  }

  setMagnetUrl(url: string) {
    this.state.magnetUrl = url;
  }

  findUserInRoom(userToFind: UserEntity): UserEntity | undefined {
    return this.state.users.find(user => user.isEqual(userToFind));
  }

  addUser(userToAdd: UserEntity): RoomEntity {
    if (this.findUserInRoom(userToAdd)) {
      return this;
    }

    this.state.users.push(userToAdd);

    return this;
  }
}
