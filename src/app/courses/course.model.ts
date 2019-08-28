export class Course {
  constructor(
    public id: string,
    public name: string,
    public imgUrl: string
  ) {}

  toObject() {
    return {
      id: this.id,
      name: this.name,
      imgUrl: this.imgUrl
    };
  }
}

export class Topic {
  constructor(
    public id: string,
    public name: string
  ) {}

  toObject() {
    return {
      id: this.id,
      name: this.name
    };
  }
}

export class Activity {
  constructor(
    public id: string,
    public name: string,
    public type: string,
    public pageUrl: string
  ) {}

  toObject() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      pageUrl: this.pageUrl
    };
  }
}
