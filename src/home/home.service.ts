import { Injectable } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto } from 'src/user/Dtos/home.dto';


interface HomeParams {
    
    address: string;
    bedrooms: number;
    bathrooms: number;
    city:      string;
    // listed_date:   DateTime     @default(now())
    price:         number;
    land_size:     number;
    property_type: PropertyType;
    images? :        string;
    agent_id:      number;
    // agent:         User         @relation(fields: [agent_id], references: [id])
    // message:       Message[]
}

@Injectable()
export class HomeService {

    constructor(
        private readonly prismaService: PrismaService
    ){}

    getHomes(){
        return this.prismaService.home.findMany()
    }

    async getHomesById(id: number){
        return await this.prismaService.home.findUnique({
            where: {
                id
            }
        })
    }

    async createHome(body: HomeParams) {
        return await this.prismaService.home.create(
            {
                data: {
                    address: body.address,
                    bedrooms: body.bedrooms,
                    bathrooms: body.bathrooms,
                    city: body.city,
                    price: body.price,
                    land_size: body.land_size,
                    property_type: body.property_type,
                    agent_id: body.agent_id

                }
            }
        )
    }
}
