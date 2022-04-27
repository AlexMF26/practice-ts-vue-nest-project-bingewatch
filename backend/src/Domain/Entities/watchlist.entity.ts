import { WatchlistItem } from '@prisma/client';

export type Watchlist = WatchlistItem[];

export class WatchlistItemEntity implements WatchlistItem {
  readonly id: string;
  readonly userId: string;
  readonly entryId: string;
  readonly progress: number;
  readonly rating: number | null;
  constructor(data: WatchlistItem) {
    Object.assign(this, data);
  }
}
