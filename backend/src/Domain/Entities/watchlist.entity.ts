import { WatchlistItem } from '@prisma/client';

export type WatchlistEntity = WatchlistItemEntity[];

export class WatchlistItemEntity implements WatchlistItem {
  public readonly id: string;
  public readonly userId: string;
  public readonly entryId: string;
  public readonly progress: number;
  public readonly rating: number | null;
  public constructor(data: WatchlistItem) {
    Object.assign(this, data);
  }
}
