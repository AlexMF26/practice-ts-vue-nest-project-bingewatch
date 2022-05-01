import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntriesService } from '../../../../Logic/Services/entries.service';

@Controller('entries')
@ApiTags('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  private readonly logger = new Logger(EntriesController.name);
}
