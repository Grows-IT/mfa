export class Category {
  constructor(
    public id: number,
    public name: string,
    public imgUrl?: string,
    public imgData?: string
  ) { }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      imgUrl: this.imgUrl,
      imgData: this.imgData
    };
  }
}

export class Course {
  constructor(
    public id: number,
    public name: string,
    public img?: string,
    public categoryId?: number,
    public topics?: Topic[],
  ) { }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      img: this.img,
      categoryId: this.categoryId,
      topics: this.topics ? this.topics.map(topic => topic.toObject()) : null
    };
  }
}

export class Topic {
  constructor(
    public id: number,
    public name: string,
    public activities: any[]
  ) { }

  toObject() {
    return {
      id: this.id,
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
    public name: string
  ) { }

  toObject() {
    return {
      id: this.id,
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
      resources: this.resources ? this.resources.map(resource => resource.toObject()) : null,
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
  ) { }

  toObject() {
    return {
      name: this.name,
      type: this.type,
      url: this.url,
      data: this.data
    };
  }
}


