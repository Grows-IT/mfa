export class Course {
  constructor(
    public id: number,
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
    public id: number,
    public name: string,
    public activities: Activity[]
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
    public id: number,
    public name: string,
    public type: string,
  ) {}

  toObject() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
    };
  }
}
