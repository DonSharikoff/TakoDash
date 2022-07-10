import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { UserService } from '../user.service';

export function EmailExist(isReverse: boolean = false, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'EmailExist',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [isReverse],
            options: validationOptions,
            validator: EmailExistValidator
        });
    };
}

@ValidatorConstraint({name: 'EmailExist', async: true})
export class EmailExistValidator implements ValidatorConstraintInterface {

    public constructor(private userService: UserService) {}

    async validate(value: string, arg: ValidationArguments) {
        const obs$ = this.userService.findUser({email: value}).pipe(
            map(() => true),
            catchError(() => of(false))
        )
        const result = await lastValueFrom<boolean>(obs$);
        return (arg.constraints[0]) ? !result : result;
    }

    defaultMessage(args: ValidationArguments) {
        return (args.constraints[0]) ? 'Email $value already exist' : 'This email not exist';
    }
}
