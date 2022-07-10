import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FileService {

    public static readonly storagePath = path.resolve(__dirname, '../../', 'storage');

    public static readonly pemPath = path.resolve(FileService.storagePath, 'keys');
    public static readonly publicKeyPemPath = FileService.pemPath + '/public.key';
    public static readonly privateKeyPemPath = FileService.pemPath + '/private.key';
}
