import { Controller, Delete, Get, Param, Post, Put,Body,  ClassSerializerInterceptor, UseInterceptors, Query} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto } from 'src/home/Dtos/home.dto';
import { PropertyType } from '@prisma/client';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('home')
export class HomeController {

    constructor(private readonly homeService: HomeService){}

    @Get()
    getHomes(
            @Query('city') city?: string,
            @Query('minPrice') minPrice?: string,
            @Query('maxPrice') maxPrice?: string,
            @Query('bedrooms') bedrooms?: string,
            @Query('bathrooms') bathrooms?: string,
            @Query('propertyType') propertyType?: PropertyType,
    ): Promise<HomeResponseDto[]> {
        const price = minPrice || maxPrice ? {
            ...(minPrice && {gte: parseFloat(minPrice)}),
            ...(maxPrice && {lte: parseFloat(maxPrice)})
        } : undefined 

        const filters = {
            //verifies query param is not undefined and wraps in object
            // aka short circuit evaluation
            ...(city && {city}),
            price,
            ...(bedrooms && {bedrooms: parseInt(bedrooms)}),
            ...(bathrooms && {bathrooms: parseFloat(bathrooms)}),
            ...(propertyType && {propertyType})
        }
        return this.homeService.getHomes(filters);
    }

    @Get(':id')
    getHomebyId(
        @Param('id') id: number
        ){
        return this.homeService.getHomesById(id)
    }

    @Post()
    createHome(
        @Body() body: CreateHomeDto

    ){
        return this.homeService.createHome(body)
    }

    @Put(':id')
    updateHome(){}

    @Delete(':id')
    deleteHome(){}
}
