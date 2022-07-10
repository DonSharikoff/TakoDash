import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({versionKey: false})
export class User {

    @Prop({required: true})
    @ApiProperty({type: String})
    public name: string;

    @Prop({required: true, unique: true})
    @ApiProperty({type: String, uniqueItems: true})
    public email: string

    @Prop({required: true})
    @ApiProperty({type: String})
    public password: string

    @Prop()
    @ApiProperty({type: String})
    public rtToken: string
}

export const UserSchema = SchemaFactory.createForClass(User);
