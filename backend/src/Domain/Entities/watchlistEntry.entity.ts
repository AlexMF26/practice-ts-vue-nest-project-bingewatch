import { Entry, WatchlistItem } from '@prisma/client';
import { EntryEntity } from './entry.entity';

export type WatchlistEntriesEntity = WatchlistEntryItemEntity[];

export class WatchlistEntryItemEntity {
  public readonly entry: EntryEntity;
  public readonly progress: number;
  public readonly rating: number | null;
  public readonly id: string;
  public constructor(data: WatchlistItem & { entry: Entry }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { entry, userId, entryId, ...watchlistItemInfo } = data;
    this.entry = new EntryEntity(entry);
    Object.assign(this, watchlistItemInfo);
  }
}
