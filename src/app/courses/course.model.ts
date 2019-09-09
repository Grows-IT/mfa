import { Observable } from 'rxjs';

export class Course {
  constructor(
    public id: number,
    public name: string,
    public topics?: Topic[]
  ) {}

  toObject() {
    return {
      id: this.id,
      name: this.name
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
    public content: string,
    public resources?: PageResource[]
  ) {}
}

export class PageResource {
  constructor(
    public name: string,
    public data?: Blob
  ) {}
}

export class Quiz {
  constructor(
    public id: number,
    public name: string
  ) {}
}

