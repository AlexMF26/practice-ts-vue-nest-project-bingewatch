import { Entry, WatchlistItem } from '@prisma/client';
import { EntryEntity } from './entry.entity';

export type WatchlistEntity = DetailedWatchlistItemEntity[];

export class DetailedWatchlistItemEntity {
  public readonly entry: EntryEntity;
  public readonly id: string;
  public readonly rating: number | null;
  public readonly reviewId: string | null;
  public readonly progress: number;
  public constructor(data: WatchlistItem & { entry: Entry }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { entry, userId, entryId, ...watchlistItemInfo } = data;
    this.entry = new EntryEntity(entry);
    Object.assign(this, watchlistItemInfo);
  }
}

export class WatchlistItemEntity implements WatchlistItem {
  public readonly id: string;
  public readonly userId: string;
  public readonly entryId: string;
  public readonly progress: number;
  public readonly rating: number | null;
  public readonly reviewId: string | null;
  public constructor(data: WatchlistItem) {
    Object.assign(this, data);
  }
}
