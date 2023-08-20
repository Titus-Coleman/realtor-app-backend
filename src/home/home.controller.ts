import { Controller, Delete, Get, Param, Post, Put,Body } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from 'src/user/Dtos/home.dto';

@Controller('home')
export class HomeController {

    constructor(private readonly homeService: HomeService){}

    @Get()
    getHomes(){
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
