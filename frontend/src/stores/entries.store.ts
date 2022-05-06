import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { EntrySearchResult } from '../types/api/interface';

export const useEntriesStore = defineStore('entries', {
  state: () => ({}),
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
  },
});
