import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import {
  CreateItemDto,
  DetailedWatchlistItemEntity,
  UpdateItemDto,
  WatchlistItemEntity,
} from '../types/api/interface';

export const useWatchlistStore = defineStore('watchlist', {
  actions: {
    async getWatchlist(userId: string) {
      const response = await api.get<DetailedWatchlistItemEntity[]>(
        `/watchlist/${userId}`
      );
      return response.data;
    },
    async getWatchListItem(userId: string, imdbId: string) {
      const response = await api.get<WatchlistItemEntity>(
        `/watchlist/${userId}/${imdbId}`
      );
      return response.data;
    },
    async addWatchListItem(createItemDto: CreateItemDto) {
      const response = await api.post<WatchlistItemEntity>(
        '/watchlist/item',
        createItemDto
      );
      return response.data;
    },
    async deleteWatchListItem(itemId: string) {
      const response = await api.delete<WatchlistItemEntity>(
        `/watchlist/item/${itemId}`
      );
      return response.data;
    },
    async updateWatchListItem(itemId: string, updateItemDto: UpdateItemDto) {
      const response = await api.put<WatchlistItemEntity>(
        `/watchlist/item/${itemId}`,
        updateItemDto
      );
      return response.data;
    },
  },
});
