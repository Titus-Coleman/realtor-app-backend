import { Controller, Delete, Get, Param, Post, Put,Body,  ClassSerializerInterceptor, UseInterceptors, Query, ParseIntPipe, HttpException, HttpStatus} from '@nestjs/common';
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
    async updateHome(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateHomeDto,
        @User() user: UserData
    ){
      
        const agent = await this.homeService.getAgentByHomeId(id)
       
        if(agent !== user.id ){
            throw new HttpException('User is not authorized to edit this home', HttpStatus.UNAUTHORIZED)
        }

        return await this.homeService.updateHome(id, body)
    }

    @Delete(':id')
    async deleteHome(
        @Param('id', ParseIntPipe) id: number,
        @User() user: UserData
    ){
        if(!user.id){
            throw new HttpException('Please login to delete this home', HttpStatus.UNAUTHORIZED)
        }


        const agent = await this.homeService.getAgentByHomeId(id)

        if(agent !== user.id ){
            throw new HttpException('User is not authorized to delete this home', HttpStatus.UNAUTHORIZED)
        }

        return await this.homeService.deleteHome(id)
    }
}
