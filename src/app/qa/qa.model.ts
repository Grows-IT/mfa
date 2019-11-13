export class Forum {
  constructor(
    public id: number,
    public name: string
  ) {}

  toObject() {
    return {
      id: this.id,
      name: this.name,
      type: 'forum'
    };
  }
}

export class Post {
  constructor(
    public id: number,
    public subject: string,
    public message: string,
    public username: string,
    public date?: Date
  ) {}
}

export class Discussion {
  constructor(
    public id: number,
    public subject: string,
    public username: string,
    public message: string,
    public date?: Date
  ) {}
}
