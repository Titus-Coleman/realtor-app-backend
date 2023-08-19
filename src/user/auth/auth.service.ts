import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserType } from '@prisma/client';
import * as jwt from "jsonwebtoken"



interface SignupParams {
    email: string;
    password: string;
    name: string;
    phone: string;
}

@Injectable()
export class AuthService {

    constructor(
        private readonly prismaService: PrismaService
    ){}

    async signup({email, password, name, phone}: SignupParams) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

       if(userExists) {
        throw new ConflictException('This email exists')
       }

       const hashPw = await bcrypt.hash(password, 10)
    //    const isMatch = await bcrypt.compare(password, hashPw);

    //    if(!isMatch) {
    //     throw new UnauthorizedException
    //    }
    const user = await this.prismaService.user.create({
        data: {
            email,
            name,
            phone,
            password: hashPw,
            user_type: UserType.BUYER
        }
    })
    const token = await jwt.sign(
        {name, id: user.id}, 
        process.env.JSON_TOKEN_KEY,{
        expiresIn: 360000,
    })

    return token

    }

}
