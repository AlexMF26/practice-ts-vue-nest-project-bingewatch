import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { i18n } from '../boot/i18n';
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
      useAlertsStore().addAlert(
        i18n.global.t('alerts.opinions.reviewAdded'),
        AlertType.Success,
        5000
      );
      return response.data;
    },
    async addReply(opinionId: string, dto: OpinionContentDto) {
      const response = await api.post<OpinionEntity>(
        `/opinions/${opinionId}/replies`,
        dto
      );
      this.opinions.push(response.data);
      useAlertsStore().addAlert(
        i18n.global.t('alerts.opinions.replyAdded'),
        AlertType.Success,
        5000
      );
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
        useAlertsStore().addAlert(
          i18n.global.t('alerts.opinions.opinionUpdated'),
          AlertType.Success,
          5000
        );
      }
    },
    async deleteOpinion(opinionId: string) {
      const response = await api.delete<OpinionEntity>(
        `/opinions/${opinionId}`
      );
      const opinion = response.data;
      const partialDeletion =
        opinion.text === null && opinion.authorId === null;
      if (partialDeletion) {
        const index = this.opinions.findIndex(
          (opinion) => opinion.id === opinionId
        );
        if (index !== -1) {
          this.opinions[index] = opinion;
        }
      } else {
        this.opinions = this.opinions.filter(
          (opinion) => opinion.id !== opinionId
        );
      }
      useAlertsStore().addAlert(
        i18n.global.t('alerts.opinions.opinionDeleted'),
        AlertType.Success,
        5000
      );
    },
  },
});
