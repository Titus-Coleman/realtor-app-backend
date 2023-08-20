import { Controller, Post, Body, Get, Param, ParseEnumPipe, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../Dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @Post('/signup/:userType')
    async signup(
        @Body() body: SignupDto,
        @Param('userType', new ParseEnumPipe(UserType)) userType: UserType
    ){

        if(userType !== UserType.BUYER){
            if(!body.productKey){
                throw new HttpException("Please include your product key", HttpStatus.UNAUTHORIZED)
            }

            const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

            const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey)

            if(!isValidProductKey){
                throw new UnauthorizedException()
            }
        }
        return this.authService.signup(body, userType)
    }

    @Post("/signin")
    signin(
        @Body() body: SigninDto
    ) {
        return this.authService.signin(body)
    }

    @Get("/key")
    generateProductKey(
        @Body() {email, userType}: GenerateProductKeyDto
    ){
        return this.authService.generateProductKey(email, userType)
    }
}
