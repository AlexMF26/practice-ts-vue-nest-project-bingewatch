import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthentificationService } from '../Logic/Services/authentication.service';
import { JwtStrategy } from '../Presentation/HTTP/Guards/jwt.strategy';
import { AuthentificationController } from '../Presentation/HTTP/REST/Controllers/authentification.controller';
import { EncryptionModule } from './encryption.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    EncryptionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  providers: [AuthentificationService, JwtStrategy],
  controllers: [AuthentificationController],
})
export class AuthentificationModule {}
