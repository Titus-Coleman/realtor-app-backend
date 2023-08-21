import { Controller, Delete, Get, Param, Post, Put,Body,  ClassSerializerInterceptor, UseInterceptors} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto } from 'src/home/Dtos/home.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('home')
export class HomeController {

    constructor(private readonly homeService: HomeService){}

    @Get()
    getHomes(): Promise<HomeResponseDto[]> {
        return this.homeService.getHomes();
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
