export class RefreshEntryDataEvent {
  readonly imdbId: string;
  constructor(imdbId: string) {
    this.imdbId = imdbId;
  }
}
