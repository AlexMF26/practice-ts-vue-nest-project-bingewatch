import { Entry, WatchlistItem } from '@prisma/client';
import { EntryEntity } from './entry.entity';

export type WatchlistEntriesEntity = WatchlistEntryItemEntity[];

export class WatchlistEntryItemEntity {
  readonly entry: EntryEntity;
  readonly progress: number;
  readonly rating: number | null;
  readonly id: string;
  constructor(data: WatchlistItem & { entry: Entry }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { entry, userId, entryId, ...watchlistItemInfo } = data;
    this.entry = new EntryEntity(entry);
    Object.assign(this, watchlistItemInfo);
  }
}
