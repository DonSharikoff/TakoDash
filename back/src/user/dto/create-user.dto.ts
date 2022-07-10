import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public readonly name: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    public readonly email: string

    @MaxLength(32)
    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public readonly password:string

}
