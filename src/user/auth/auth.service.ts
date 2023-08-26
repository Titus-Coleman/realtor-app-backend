import { Injectable, ConflictException, UnauthorizedException, HttpException } from '@nestjs/common';
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

interface SigninParams {
    email: string;
    password: string;
}

@Injectable()
export class AuthService {

    constructor(
        private readonly prismaService: PrismaService
    ){}

    async signup({email, password, name, phone}: SignupParams, userType: UserType) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

       if(userExists) {
        throw new ConflictException('This email exists')
       }

       const hashPw = await bcrypt.hash(password, 10)

    const user = await this.prismaService.user.create({
        data: {
            email,
            name,
            phone,
            password: hashPw,
            user_type: userType
        }
    })
    return this.generateJWT(user.name,user.id)


    }


    async signin({email, password}: SigninParams){
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if(!user) {
            throw new HttpException('Invalid credentials', 400)
           }
        
        const hashedPw = user.password
        const isValidPassword = await bcrypt.compare(password, hashedPw);

       if(!isValidPassword) {
        throw new HttpException('Invalid credentials', 400)
       }

       return this.generateJWT(user.name,user.id)
    }

   private async generateJWT(name: string, id:number){
    const token = await jwt.sign(
        {
            name, 
            id
        }, 
        process.env.JSON_TOKEN_KEY,{
        expiresIn: 360000,
    })
    console.log(token)
    return token
   }


    generateProductKey(email: string, userType: UserType){
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

    return bcrypt.hash(string, 10)
   }
}
