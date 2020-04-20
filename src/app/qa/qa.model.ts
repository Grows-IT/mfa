export class Forum {
  constructor(
    public id: number,
    public name: string
  ) { }

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
  ) { }

  toObject() {
    return {
      id: this.id,
      subject: this.subject,
      message: this.message,
      username: this.username,
      date: this.date
    };
  }
}

export class Discussion {
  constructor(
    public id: number,
    public subject: string,
    public username: string,
    public date?: Date
  ) { }

  toObject() {
    return {
      id: this.id,
      subject: this.subject,
      username: this.username,
      date: this.date
    };
  }
}

