import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaClient, UserType } from "@prisma/client";
import * as jwt from "jsonwebtoken"
import { PrismaService } from "src/prisma/prisma.service";


interface JWTPayload {
    name: string,
    id: number,
    iat: number,
    exp: number
}


@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private readonly reflector: Reflector,
        private readonly prismaService: PrismaService
        ){}

    async canActivate(context: ExecutionContext){
        // 1: Determine the UserType authorized to execute the endpoint
        const roles = this.reflector.getAllAndOverride("roles", [
            context.getHandler(),
            context.getClass()
        ])
        if(roles.length){
        // 2: Verify the JWT from the request header
        const request = context.switchToHttp().getRequest()
        const token = request.headers?.authorization?.split("Bearer ")[1]
            try {
                const payload = (await jwt.verify(token, process.env.JSON_TOKEN_KEY)) as JWTPayload
                // 3: Database request to get user by id
                const user = await this.prismaService.user.findUnique({
                    where: {
                       id: payload.id 
                    }
                })
                if(!user){
                    return false
                }
                 // 4: Confirm if user has valid permissions
                if (!roles.includes(user.user_type)){
                    // throw new HttpException("sorry", HttpStatus.FORBIDDEN)
                    return false
                }
                return true
            } catch (error) {
                throw new NotFoundException("Missing Authorization - please sign in")
                return false
            }
        }
           
            
        return true


    }

}