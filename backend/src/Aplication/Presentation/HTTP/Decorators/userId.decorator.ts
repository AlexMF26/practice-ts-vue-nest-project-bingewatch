import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const userId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const id = req.user.id;
    return id;
  },
);
