import { PropertyType, UserType } from "@prisma/client";
import { Exclude, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsPositive, IsArray, ValidateNested, ValidationTypes } from "class-validator";


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

    @Exclude()
    updated_at: Date;
    @Exclude()
    created_at: Date;
    @Exclude()
    agent_id:      number;
    
    // @IsOptional()
    image:        string;
    
    constructor(partial: Partial<HomeResponseDto>){
        Object.assign(this, partial);
    }
}

class Image {
    @IsNotEmpty()
    url: string
}



export class CreateHomeDto {
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @IsPositive()
    bedrooms: number;

    @IsNumber()
    @IsPositive()
    bathrooms: number;

    @IsString()
    @IsNotEmpty()
    city:      string;
  
    @IsNumber()
    @IsPositive()
    price:         number;

    @IsNumber()
    @IsPositive()
    land_size:     number;

    @IsEnum(PropertyType)
    property_type: PropertyType;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Image)
    images:        Image[];

    @IsNumber()
    @IsNotEmpty()
    agent_id:      number;
    // agent:         User         @relation(fields: [agent_id], references: [id])
    // message:       Message[]

}