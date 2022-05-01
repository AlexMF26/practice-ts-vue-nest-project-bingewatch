export class RefreshEntryRatingEvent {
  readonly imdbId: string;
  constructor(imdbId: string) {
    this.imdbId = imdbId;
  }
}
