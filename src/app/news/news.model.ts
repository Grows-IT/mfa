import { SafeHtml } from '@angular/platform-browser';

export class NewsArticle {
  constructor(
    public id: number,
    public name: string,
    public content: string,
    public description: SafeHtml,
  ) {}

  toObject() {
    return {
      id: this.id,
      name: this.name,
      content: this.content,
    };
  }
}
