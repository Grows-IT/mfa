export class NewsArticle {
  constructor(
    public id: number,
    public name: string,
    public content: string,
    public imgUrl?: string,
    public imgData?: string
  ) {}
}
