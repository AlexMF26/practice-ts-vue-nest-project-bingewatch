import { Module } from '@nestjs/common';
import { TasksService } from '../Logic/Services/tasks.service';
import { EntriesModule } from './entries.module';

@Module({
  imports: [EntriesModule],
  providers: [TasksService],
})
export class TasksModule {}
