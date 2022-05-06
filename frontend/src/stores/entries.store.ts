import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { EntryEntity, EntrySearchResult } from '../types/api/interface';

export const useEntriesStore = defineStore('entries', {
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
      const response = await api.get<EntryEntity>(`/entries/${id}`);
      return response.data;
    },
  },
});
