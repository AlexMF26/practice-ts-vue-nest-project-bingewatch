import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WatchlistService } from '../../../../Logic/Services/watchlist.service';

@Controller('watch')
@ApiTags('watch')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  private readonly logger = new Logger(WatchlistController.name);
}
