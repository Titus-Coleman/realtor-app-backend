import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, HomeResponseDto } from 'src/home/Dtos/home.dto';


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

interface FilterParams {
    propertyType?: PropertyType;
    bathrooms?: number;
    bedrooms?: number;
    price?: {
        lte?: number;
        gte?: number;
    };
    city?: string;
}

@Injectable()
export class HomeService {

    constructor(
        private readonly prismaService: PrismaService
    ){}

    async getHomes(filters: FilterParams): Promise<HomeResponseDto[]> {
        const homes = await this.prismaService.home.findMany(
            {
            select: {
                id: true,
                address: true,
                city: true,
                price: true,
                property_type: true,
                bathrooms: true,
                bedrooms: true,
                images: {
                    select: {
                        url: true,
                    },
                    take: 1,
                },
            },
            where: 
            {
                city: filters.city,
                bathrooms: filters.bathrooms,
                bedrooms: filters.bedrooms,
                price: filters.price,
                property_type: filters.propertyType
                
            },
    })
     
        if(!homes.length){
            throw new NotFoundException
        }
       return homes.map((home) => 
        {
            const fetchHome = {...home, image: home.images[0].url}
            delete fetchHome.images
             return new HomeResponseDto(fetchHome)
        })
        
    }
    
    async getHomesById(id: number){
        return await this.prismaService.home.findUnique({
            where: {
                id
            },
            select: {
                address: true,
                city: true,
                price: true,
                property_type: true,
                bathrooms: true,
                bedrooms: true,
                images: true
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
