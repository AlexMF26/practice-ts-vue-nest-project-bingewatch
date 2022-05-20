import { Opinion } from '@prisma/client';

export class OpinionEntity implements Opinion {
  public readonly id: string;
  public readonly authorId: string | null;
  public readonly entryImdb: string | null;
  public readonly replyToId: string | null;
  public readonly text: string | null;

  public constructor(data: Opinion) {
    Object.assign(this, data);
  }
}
