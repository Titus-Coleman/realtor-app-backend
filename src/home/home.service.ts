import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, FilterParams, HomeResponseDto, UpdateHomeDto } from 'src/home/Dtos/home.dto';



@Injectable()
export class HomeService {

    constructor(
        private readonly prismaService: PrismaService
    ){}

    async getHomes(filters: FilterParams ): Promise<HomeResponseDto[]> {
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

    async createHome({
        address,
        bedrooms,
        bathrooms,
        city,
        price,
        land_size,
        property_type,
        agent_id,
        images
    }: CreateHomeDto): Promise<HomeResponseDto> {
       const home = await this.prismaService.home.create(
            {
                data: {
                    address,
                    bedrooms,
                    bathrooms,
                    city,
                    price,
                    land_size,
                    property_type,
                    agent_id,
                }
            }
        )
        
        const homeImages = 
            images.map(image => {return {...image, home_id: home.id}})
       
        await this.prismaService.image.createMany({data: homeImages})
        

        const newHome = {
            ...home,
            image: images[0].url
        }

        return newHome
    }

    async updateHome(
        id: number, 
        {
            address,
            bedrooms,
            bathrooms,
            city,
            price,
            land_size,
            property_type,
        }: UpdateHomeDto): Promise<HomeResponseDto> {
            const home = await this.prismaService.home.findUnique({
                where: {
                    id,
                }
            })
            if(!home) {
                throw new NotFoundException();
            }

            const updatedHome =  await this.prismaService.home.update({
            where: {
                id
            },
            data: {
                address,
                bedrooms,
                bathrooms,
                city,
                price,
                land_size,
                property_type
            }
        })
        return updatedHome
    }

    async deleteHome(id: number){
        const home = await this.prismaService.home.findUnique({
            where: {
                id,
            }
        })
        if(!home) {
            throw new NotFoundException();
        }


        await this.prismaService.image.deleteMany({
            where: {
                home_id: id
        }})
        await this.prismaService.home.delete({
            where: {
                id
            }
        })

        const confirmDelete = await this.prismaService.home.findUnique({
            where: {
                id
            }
        })

        if(!confirmDelete){
            return `Home:${id} has been deleted`
        }
   
    }
}
