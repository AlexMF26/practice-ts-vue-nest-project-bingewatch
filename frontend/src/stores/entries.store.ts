import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import {
  EntryEntity,
  EntrySearchResult,
  WatchlistItemEntity,
} from '../types/api/interface';
import { useAuthStore } from './auth.store';
import { useWatchlistStore } from './watchlist.store';

export type EntryState = {
  entry: EntryEntity | null;
  userData: Omit<WatchlistItemEntity, 'entry'> | null;
};

export const useEntriesStore = defineStore('entries', {
  state: () =>
    ({
      entry: null,
      userData: null,
    } as EntryState),

  actions: {
    async query(query: string) {
      const response = await api.post<EntrySearchResult[]>(
        '/entries/search',
        {},
        {
          params: {
            query,
          },
        }
      );
      return response.data;
    },
    async get(id: string) {
      await this.getEntry(id);
      const authStore = useAuthStore();
      const loggedIn = authStore.loggedIn;
      if (loggedIn) {
        const watchlistStore = useWatchlistStore();
        const userId = authStore.userId;
        await watchlistStore.getWatchListItem(userId, id);
      } else {
        this.userData = null;
      }
    },
    async getEntry(id: string) {
      const response = await api.get<EntryEntity>(`/entries/${id}`);
      this.entry = response.data;
      return response.data;
    },
    async getUserData(imdbId: string, userId: string) {
      const watchlistStore = useWatchlistStore();
      const detailedEntry = await watchlistStore.getWatchListItem(
        userId,
        imdbId
      );
      this.userData = detailedEntry;
      return this.userData;
    },
  },
});
