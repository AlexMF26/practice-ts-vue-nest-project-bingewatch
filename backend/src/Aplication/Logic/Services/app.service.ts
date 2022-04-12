import { Injectable } from '@nestjs/common';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: RepositoryService) {}
  async getHello() {
    await this.prisma.user.create({
      data: { email: `${(Math.random() + 1).toString(36)}`, name: 'test' },
    });
    const users = await this.prisma.user.findMany();
    return users;
  }
}
