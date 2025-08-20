import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';

@Module({})
export class GoalModule {
  static forRoot<T>(arg0: { driver: ApolloDriver; }): import("@nestjs/common").Type<any> | import("@nestjs/common").DynamicModule | Promise<import("@nestjs/common").DynamicModule> | import("@nestjs/common").ForwardReference<any> {
    throw new Error('Method not implemented.');
  }
}
