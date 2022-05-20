import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '../Presentation/HTTP/REST/Controllers/app.controller';
import { UsersModule } from './users.module';
import { config } from '../config';
import { AuthentificationModule } from './authentication.module';
import { EntriesModule } from './entries.module';
import { WatchlistModule } from './watchlist.module';
import { TasksModule } from './tasks.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersService } from '../Logic/Services/users.service';
import { OpinionsModule } from './opinions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: config.validationSchema,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    TasksModule,
    UsersModule,
    AuthentificationModule,
    EntriesModule,
    WatchlistModule,
    OpinionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const defAdminName = this.configService.get<string>('DEFAULT_ADMIN_NAME');
    const defAdminPass = this.configService.get<string>(
      'DEFAULT_ADMIN_PASSWORD',
    );
    const defAdminEmail = this.configService.get<string>('DEFAULT_ADMIN_EMAIL');
    return await this.usersService.defaultAdminInit({
      password: defAdminPass,
      email: defAdminEmail,
      name: defAdminName,
    });
  }
}
