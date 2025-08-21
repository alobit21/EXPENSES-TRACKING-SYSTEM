// gql-auth.guard.ts
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(GqlAuthGuard.name);

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    this.logger.debug(`Request headers: ${JSON.stringify(request.headers)}`);
    return request;
  }

  handleRequest(err, user, info) {
    this.logger.debug(`Auth result - Error: ${err}, User: ${JSON.stringify(user)}, Info: ${info}`);
    
    if (err || !user) {
      this.logger.error(`Authentication failed: ${err || 'No user'}`);
      throw err || new Error('Authentication failed');
    }
    
    this.logger.debug(`Authentication successful for user: ${user.id}`);
    return user;
  }
}