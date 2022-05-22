import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { AlertType } from '../types/Alert';
import {
  AddReviewDto,
  OpinionContentDto,
  OpinionEntity,
} from '../types/api/interface';
import { useAlertsStore } from './alerts.store';

export type OpinionsState = {
  opinions: OpinionEntity[];
};

export const useOpinionsStore = defineStore('opinions', {
  state: () =>
    ({
      opinions: [],
    } as OpinionsState),

  actions: {
    async getReviews(entryId: string) {
      const response = await api.get<OpinionEntity[]>(
        `/entries/${entryId}/reviews`
      );
      this.opinions = response.data;
      return this.opinions;
    },
    async getReplies(opinionId: string) {
      const response = await api.get<OpinionEntity[]>(
        `/opinions/${opinionId}/replies`
      );
      this.opinions = response.data;
      return this.opinions;
    },
    async addReview(dto: AddReviewDto) {
      const response = await api.post<OpinionEntity>('/opinions', dto);
      this.opinions.push(response.data);
      return response.data;
    },
    async addReply(opinionId: string, dto: OpinionContentDto) {
      const response = await api.post<OpinionEntity>(
        `/opinions/${opinionId}/replies`,
        dto
      );
      this.opinions.push(response.data);
      useAlertsStore().addAlert('Reply added', AlertType.Success, 5000);
      return response.data;
    },
    async changeOpionion(opinionId: string, dto: OpinionContentDto) {
      const response = await api.patch<OpinionEntity>(
        `/opinions/${opinionId}`,
        dto
      );
      const index = this.opinions.findIndex(
        (opinion) => opinion.id === opinionId
      );
      if (index !== -1) {
        this.opinions[index] = response.data;
      }
    },
    async deleteOpinion(opinionId: string) {
      await api.delete(`/opinions/${opinionId}`);
      this.opinions = this.opinions.filter(
        (opinion) => opinion.id !== opinionId
      );
    },
  },
});
