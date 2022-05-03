export class BearerTokenEntity {
  public readonly accessToken: string;
  public readonly tokenType: 'Bearer';

  public constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.tokenType = 'Bearer';
  }
}
