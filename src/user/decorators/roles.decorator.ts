import { SetMetadata } from "@nestjs/common";
import { UserType } from "@prisma/client";


// 1: Takes the roles entered in the Roles decorator in the controller
// 2: Puts them into a roles arrary
// 3: SetMetadata takes the array values with a key set to 'roles'
export const Roles = (...roles: UserType[]) => SetMetadata('roles',roles)