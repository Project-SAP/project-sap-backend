import { UserRepository } from './../data-access/user.db';
import { User } from './../models/user.model';
/**
 * A service that calls out to the data access layer
 */
export class UserService {
    private readonly userRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({email});
    }

    public async newUser(email: string, password: string): Promise<User> {
        let dateTime = new Date();
        return this.userRepository.create({email, password, dateTime});
    }
}
