import { User, UserModel } from '../models/user.model';
import { UserSchema } from './../models/schemas/user.schema';
import { BaseRepository } from './base.db';

export class UserRepository extends BaseRepository<UserModel> {
    constructor() {
        super('users', UserSchema);
    }

    public findByEmail(email: string): Promise<User> {
        return this.repositoryModel
            .findOne({
                email,
            })
            .catch((error) => {
                // console.log(error);
                return null;
            });
    }
}
