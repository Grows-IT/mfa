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
    public activities: any[]
  ) {}

  toObject() {
    return {
      id: this.id,
      name: this.name
    };
  }
}

export class Page {
  constructor(
    public id: number,
    public name: string,
    public content: string
  ) {}
}

export class Quiz {
  constructor(public id: number) {}
}

