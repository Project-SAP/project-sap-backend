import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { User, UserMethods, UserModel } from '../user.model';

/**
 * Schema setup for @type {User}
 */
const UserSchema: Schema = new Schema<User, {}, UserMethods>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

/**
 * When saving a user model, always hash the password
 */
UserSchema.pre('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(user.password, 24);

    this.password = hash;
    next();
});

/**
 * Validate a given password with it the related database password
 * @param password login request password that needs validated
 */
UserSchema.methods.isValidPassword = function (password: string) {
    const user = this;
    const compare = bcrypt.compareSync(password, user.password);

    return compare;
};

/**
 * A model based on the given schema. Repository object that abstracts and simplifies database calls.
 */
export const UserRepository: UserModel = mongoose.model<User, UserModel>(
    'user',
    UserSchema
);
