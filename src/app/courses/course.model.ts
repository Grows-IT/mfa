import { Observable } from 'rxjs';

export class Course {
  constructor(
    public id: number,
    public name: string,
    public imgUrl: string,
    public topics?: Topic[]
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
    public resources: PageResource[],
    public content?: string,
  ) {}
}

export class PageResource {
  constructor(
    public name: string,
    public url: string,
    public type: string,
    public data?: string | Blob
  ) {}
}

export class Quiz {
  constructor(
    public id: number,
    public name: string
  ) {}
}

