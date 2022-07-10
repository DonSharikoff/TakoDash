import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { from, Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { MongooseHelper } from '../helpers/mongoose.helper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    public constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    public create(dto: CreateUserDto): Observable<UserDocument> {
        return from(
            this.userModel.create(
                Object.assign(dto, {password: bcrypt.hashSync(dto.password, 11)})
            )
        );
    }

    public update(updatedDate: UpdateQuery<UserDocument>, filer: FilterQuery<UserDocument>): Observable<number> {
        return MongooseHelper.update(this.userModel, updatedDate, filer);
    }

    public findUser(filter: FilterQuery<UserDocument>): Observable<UserDocument> {
        return MongooseHelper.findOneOrError(this.userModel, filter);
    }

    public all(): Observable<UserDocument[]> {
        return from(this.userModel.find().exec());
    }
}
