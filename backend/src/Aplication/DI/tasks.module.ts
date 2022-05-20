import { Module } from '@nestjs/common';
import { TasksService } from '../Logic/Services/tasks.service';
import { EntriesModule } from './entries.module';
import { OpinionsModule } from './opinions.module';

@Module({
  imports: [EntriesModule, OpinionsModule],
  providers: [TasksService],
})
export class TasksModule {}
