import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import {
  CreateItemDto,
  DetailedWatchlistItemEntity,
  UpdateItemDto,
  WatchlistItemEntity,
} from '../types/api/interface';
import { useEntriesStore } from './entries.store';

export type WatchlistState = {
  items: DetailedWatchlistItemEntity[];
};

export const useWatchlistStore = defineStore('watchlist', {
  state: () =>
    ({
      items: [],
    } as WatchlistState),

  actions: {
    async getWatchlist(userId: string) {
      const response = await api.get<DetailedWatchlistItemEntity[]>(
        `/watchlist/${userId}`
      );
      this.items = response.data;
      return this.items;
    },
    async getWatchListItem(userId: string, imdbId: string) {
      const response = await api.get<WatchlistItemEntity>('/watchlist', {
        params: {
          userId,
          imdbId,
        },
      });
      return response.data;
    },
    async addWatchListItem(createItemDto: CreateItemDto) {
      const response = await api.post<WatchlistItemEntity>(
        '/watchlist/item',
        createItemDto
      );
      const entryStore = useEntriesStore();
      const entry = await entryStore.getEntry(createItemDto.imdbId);
      const { progress, rating, id } = response.data;
      this.items.push({
        entry: entry,
        progress,
        rating,
        id,
      });
      return response.data;
    },
    async deleteWatchListItem(itemId: string) {
      const response = await api.delete<WatchlistItemEntity>(
        `/watchlist/item/${itemId}`
      );
      const { id } = response.data;
      this.items = this.items.filter((item) => item.id !== id);
      return null;
    },
    async updateWatchListItem(itemId: string, updateItemDto: UpdateItemDto) {
      const response = await api.patch<WatchlistItemEntity>(
        `/watchlist/item/${itemId}`,
        updateItemDto
      );
      const index = this.items.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        const entryStore = useEntriesStore();
        const entry = await entryStore.getEntry(this.items[index].entry.imdbId);
        const { progress, rating, id } = response.data;
        this.items[index] = { entry, progress, rating, id };
      }
      return response.data;
    },
  },
});
