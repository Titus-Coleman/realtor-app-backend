import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('home')
export class HomeController {
    @Get()
    getHomes(){
        return []
    }

    @Get(':id')
    getHomebyId(){
        return {}
    }

    @Post()
    createHome(){
        return {}
    }

    @Put(':id')
    updateHome(){}

    @Delete(':id')
    deleteHome(){}
}
