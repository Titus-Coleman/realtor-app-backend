import { CallHandler, ExecutionContext, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken"

export class UserInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext, 
        handler: CallHandler) {
            const request = context.switchToHttp().getRequest()
            const token = request?.headers?.authorization?.split('Bearer ')[1];
            if(!token) {
                throw new UnauthorizedException("Please be sure to log in")
            }
            const user = await jwt.decode(token)
            request.user = user


            return handler.handle()
    }
}