interface EntityState {
  id: string;
}

export default class Entity<T extends EntityState> {
  protected state: T;

  constructor(state: T) {
    this.state = state;
  }

  setId(id: string) {
    this.state.id = id;
  }

  getId(): string {
    return this.state.id;
  }

  isEqual(entityToCompare: Entity<T>) {
    return this.getId() === entityToCompare.getId();
  }

  protected setState(state: T): Entity<T> {
    this.state = state;

    return this;
  }

  public getState(): T {
    return this.state;
  }
}
