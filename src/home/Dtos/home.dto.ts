import { PropertyType, UserType } from "@prisma/client";
import { Exclude } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional, IsNumber } from "class-validator";


export class HomeResponseDto {

    id: number;
    address: string;
    bedrooms: number;
    bathrooms: number;
    city:      string;
    listed_date:   Date;
    price:         number;
    land_size:     number;
    property_type: PropertyType;

 /* THIS EXCLUDE FEATURE DOES NOT WORK */   
    @Exclude()
    updated_at: Date;
    @Exclude()
    created_at: Date;
    @Exclude()
    agent_id:      number;
    
    // @IsOptional()
    // images?:        string;
    
    constructor(partial: Partial<HomeResponseDto>){
        Object.assign(this, partial);
    }
}

export class CreateHomeDto {
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @IsNotEmpty()
    bedrooms: number;

    @IsNumber()
    @IsNotEmpty()
    bathrooms: number;

    @IsString()
    @IsNotEmpty()
    city:      string;
    // listed_date:   DateTime     @default(now())
    @IsNumber()
    @IsNotEmpty()
    price:         number;

    @IsNumber()
    @IsNotEmpty()
    land_size:     number;

    @IsEnum(PropertyType)
    property_type: PropertyType;

    @IsOptional()
    images?:        string;

    @IsNumber()
    @IsNotEmpty()
    agent_id:      number;
    // agent:         User         @relation(fields: [agent_id], references: [id])
    // message:       Message[]

}