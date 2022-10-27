import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { User, UserMethods, UserModel } from '../user.model';

/**
 * Schema setup for @type {User}
 */
const UserSchema: Schema = new Schema<User, UserModel, UserMethods>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: false,
        unique: true,
    },
    active: {
        type: Boolean,
        required: true,
        // TODO: Determine if email validation is required. If so, then this will need to be updated to default to false.
        default: true,
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});

/**
 * When saving a user model, always hash the password
 */
UserSchema.pre('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(user.password, 10);

    this.password = hash;
    next();
});

/**
 * A model based on the given schema. Repository object that abstracts and simplifies database calls.
 */
export const UserRepository: UserModel = mongoose.model<User, UserModel>(
    'user',
    UserSchema
);
