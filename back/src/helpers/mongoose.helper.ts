import { from, map, mergeMap, Observable, of, throwError } from 'rxjs';
import { FilterQuery, Model, QueryOptions, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export class MongooseHelper {

    public static findOneOrError<T>(model: Model<T>, filter?: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null): Observable<T> {
        return from(model.findOne(filter, projection, options)).pipe(
            mergeMap(user => (user)
                ? of(user)
                : throwError(() => new HttpException(`${model.modelName} not found`, HttpStatus.NOT_FOUND))
            )
        );
    }

    public static findOne<T>(model: Model<T>, filter?: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null): Observable<T> {
        return from(model.findOne(filter, projection, options));
    }

    public static update<T>(model: Model<T>, updatedDate: UpdateQuery<T>, filter?: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null): Observable<number> {
        return from(model.updateOne(filter, updatedDate, options)).pipe(
            map((result: UpdateWriteOpResult) => result.matchedCount)
        )

    }
}
