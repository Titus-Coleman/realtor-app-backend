import { Controller, Delete, Get, Param, Post, Put,Body,  ClassSerializerInterceptor, UseInterceptors, Query, ParseIntPipe, ParseEnumPipe, HttpException, HttpStatus} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from 'src/home/Dtos/home.dto';
import { PropertyType } from '@prisma/client';
import { User, UserData } from 'src/user/decorators/user.decorator';
import { OptionalEnumPipe } from './pipes/enumPipe';

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
            @Query('propertyType', new OptionalEnumPipe()) propertyType?: PropertyType,
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
        @Param('id', ParseIntPipe) id: number
        ){
        return this.homeService.getHomesById(id)
    }

    @Post()
    createHome(
        @User() user: UserData,
        @Body() body: CreateHomeDto
        

    ){
        if(!user) {
            throw new HttpException('Please login or create an account', HttpStatus.UNAUTHORIZED)
        }
        return this.homeService.createHome(body, user.id)
       
    }

    @Put(':id')
    updateHome(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateHomeDto
    ){
        return this.homeService.updateHome(id, body)
    }

    @Delete(':id')
    deleteHome(
        @Param('id', ParseIntPipe) id: number,
    ){
        return this.homeService.deleteHome(id)
    }
}
