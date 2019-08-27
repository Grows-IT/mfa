export class User {
  constructor(
    public id: string,
    public username: string,
    public firstName: string,
    public lastName: string,
    public imgUrl: string,
    private _token: string
  ) {}

  get token() {
    return this._token;
  }
}
