import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../user.model';
/**
 * Schema setup for @type {User}
 */
const UserSchema: Schema = new Schema<User>({
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
UserSchema.methods.isValidPassword = async function (password: string) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
};

const UserModel = mongoose.model<User>('user', UserSchema);

export default UserModel;