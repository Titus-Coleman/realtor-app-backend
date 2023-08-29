import { Controller, Delete, Get, Param, Post, Put,Body,  ClassSerializerInterceptor, UseInterceptors, Query, ParseIntPipe, HttpException, HttpStatus, UseGuards} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, InquiryDto, UpdateHomeDto } from 'src/home/Dtos/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserData } from 'src/user/decorators/user.decorator';
import { OptionalEnumPipe } from './pipes/enumPipe';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

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

    @Roles(UserType.AGENT, UserType.ADMIN)
    // @UseGuards(AuthGuard) implemented at the module level
    @Post()
    createHome(
        @User() user: UserData,
        @Body() body: CreateHomeDto
    ){
        if(!user) {
            throw new HttpException('Please login or create an account', HttpStatus.UNAUTHORIZED)
        }
        // return this.homeService.createHome(body, user.id)
       return 'Created Home'
    }

    @Roles(UserType.AGENT, UserType.ADMIN)
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

    @Roles(UserType.AGENT, UserType.ADMIN)
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

    @Roles(UserType.BUYER)
    @Post('/:id/inquire')
    inquire(
        @Param('id', ParseIntPipe) homeId: number,
        @Body() {message}: InquiryDto,
        @User() user: UserData
    ){
        return this.homeService.inquire(user, homeId, message)
    
    }

    @Roles(UserType.BUYER)
    @Get('/:id/messages')
    async getUserMessages(
        @Param('id', ParseIntPipe) homeId: number,
        @User() user: UserData
    ){
        return this.homeService.getUserMessages(user,homeId)
    }

    @Roles(UserType.AGENT)
    @Get('/agent/:id/messages')
    async getAgentMessages(
        @Param('id', ParseIntPipe) homeId: number,
        @User() user: UserData
    ){

        const agent = await this.homeService.getAgentByHomeId(homeId)

        if(agent !== user.id ){
            throw new HttpException('User is not authorized to view these messages', HttpStatus.UNAUTHORIZED)
        }
        return this.homeService.getAgentMessages(user,homeId)
    }
}
