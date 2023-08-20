import { PropertyType, UserType } from "@prisma/client";
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional, IsNumber } from "class-validator";

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