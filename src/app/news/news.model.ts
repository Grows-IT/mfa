export class NewsArticle {
  constructor(
    public id: number,
    public name: string,
    public content: string,
    public imgUrl?: string,
    public imgData?: string
  ) {}

  toObject() {
    return {
      id: this.id,
      name: this.name,
      content: this.content,
      imgUrl: this.imgUrl,
      imgData: this.imgData
    };
  }
}
