import { Model } from 'mongoose';

// Schema fields
export interface User {
    email: string;
    password: string;
}

// Schema methods
export interface UserMethods {
    isValidPassword(): boolean;
}

// Model type to bind fields and methods together 
export type UserModel = Model<User, {}, UserMethods>;
