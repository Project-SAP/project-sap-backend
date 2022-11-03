import { User } from '../models/user.model';
import { UserSchema } from './../models/schemas/user.schema';
import { BaseRepository } from './base.db';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super('users', UserSchema);
    }

            /**
     * Query to find single json object of given type `T`
     * Handles promise resolve and rejection generically.
     * @template T
     * @param {string} email json payload to querys
     * @returns {Promise<T>} single json entity
     */
     public insertOne(doc: {}): Promise<T> {
        return new Promise((resolve, reject) => {
            this.repositoryModel.insertOne(doc, (error: Error, response: T) => {
                if (error) {
                    reject(error);
                }
                resolve(response);
            });
        });
    }
}
