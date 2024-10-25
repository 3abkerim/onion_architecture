import { User } from "../domain/entities/user.entity";

export interface IAuthenticator {
    authenticate(token: string): Promise<User>
}