export class User {
  constructor(
    public id: string,
    public email: string,
    public firstname: string,
    public lastname: string,
    public userpictureurl: string,
    private token: string
  ) {}

  get authToken() {
    return this.token;
  }
}
