export class NewsArticle {
  constructor(
    public id: number,
    public title: string,
    public coverImg: string,
    public content?: string
  ) {}
}
