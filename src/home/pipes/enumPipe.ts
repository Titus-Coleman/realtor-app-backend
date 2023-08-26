import { Injectable, ParseEnumPipe 
, ArgumentMetadata,
BadRequestException,
PipeTransform} from "@nestjs/common";
import { PropertyType } from "@prisma/client";

@Injectable()
export class OptionalEnumPipe implements PipeTransform {

  transform(value: any) {
    if (value === undefined) {
      return value;
    }
    
    if(!Object.values(PropertyType).includes(value)) {
      throw new BadRequestException('Invalid enum value');
    }

    return value;
  }

}