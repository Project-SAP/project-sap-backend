import { User } from '../models/user.model';
import { UserSchema } from './../models/schemas/user.schema';
import { BaseRepository } from './base.db';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super('users', UserSchema);
    }
}
