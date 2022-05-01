export class RefreshEntryDataEvent {
  public readonly imdbId: string;
  public constructor(imdbId: string) {
    this.imdbId = imdbId;
  }
}
