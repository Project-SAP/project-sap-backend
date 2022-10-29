import { UserSchema } from "../../src/models/schemas/user.schema";
import { UserModel } from "../../src/models/user.model";
import { BaseInMemoryData } from './base.testDb';

export class UserInMemoryData extends BaseInMemoryData<UserModel> {
    constructor() {
        super('user', UserSchema);
    }
}
