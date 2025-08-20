import { UserService } from "../../user/user.service";
import { Args, ID, Query, Resolver } from "@nestjs/graphql";
import { User } from "../../user/user.entity";


@Resolver(() => User)
export class UserQuery {
    constructor(private readonly userServives: UserService){}


    @Query(()=> [User])
    users(){
        return this.userServives.findAll();
    }

    @Query(()=> User)
    user(@Args('id', { type: () => ID }) id: string){
        return this.userServives.findOne(id);
    }
    
}