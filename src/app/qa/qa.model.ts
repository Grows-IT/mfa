export class Post {
  constructor(
    public id: number,
    public subject: string,
    public message: string,
    public username: string,
    public date: Date
  ) {}
}
