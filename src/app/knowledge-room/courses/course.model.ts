export class Category {
  constructor(
    public id: number,
    public name: string,
    public img?: string
  ) {}
}

export class Course {
  constructor(
    public id: number,
    public name: string,
    public img?: string,
    public categoryId?: number,
    public topics?: Topic[],
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
    public resources?: PageResource[],
    public img?: string
  ) {}
}

export class PageResource {
  constructor(
    public name: string,
    public type: string,
    public url: string,
    public data?: Blob
  ) {}
}

export class Quiz {
  constructor(
    public id: number,
    public name: string
  ) {}
}

