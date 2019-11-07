export class Category {
  constructor(
    public id: number,
    public name: string,
    public imgUrl?: string,
    public imgData?: string
  ) {}
}

export class Course {
  constructor(
    public id: number,
    public categoryId: number,
    public name: string,
    public imgUrl?: string,
    public imgData?: string,
  ) {}
}

export class Topic {
  constructor(
    public id: number,
    public courseId: number,
    public name: string,
    public activities: any[]
  ) {}

  toObject() {
    return {
      id: this.id,
      courseId: this.courseId,
      name: this.name,
      activities: this.activities ? this.activities.map(activity => {
        return activity.toObject();
      }) : null
    };
  }
}

export class Quiz {
  constructor(
    public id: number,
    public instance: number,
    public name: string
  ) { }

  toObject() {
    return {
      id: this.id,
      instance: Number,
      name: this.name,
      type: 'quiz'
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
  ) { }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      type: 'page',
      content: this.content,
      resources: this.resources,
      img: this.img
    };
  }
}

export class PageResource {
  constructor(
    public name: string,
    public type: string,
    public url: string,
    public data?: string
  ) {}
}


