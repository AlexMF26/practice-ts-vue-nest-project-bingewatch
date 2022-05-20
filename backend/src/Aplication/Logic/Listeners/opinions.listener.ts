import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DeleteOpinionEvent } from '../../../Domain/Events/DeleteOpinion.event';
import { OpinionsService } from '../Services/opinions.service';

@Injectable()
export class OpinionsListener {
  private readonly logger = new Logger(OpinionsListener.name);

  public constructor(private readonly opinionsService: OpinionsService) {}

  @OnEvent(DeleteOpinionEvent.name)
  public async deleteOpinion(payload: DeleteOpinionEvent) {
    this.logger.log(`Received event: ${DeleteOpinionEvent.name}`);
    try {
      await this.opinionsService.deleteOpinionSafely(payload.id);
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
