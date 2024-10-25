import { IAuthenticator } from "../../interfaces/authenticator.interface"
import { IUserRepository } from "../../interfaces/user-repository.interface"

export class BasicAuthenticator implements IAuthenticator {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async authenticate(token: string) {
        const decoded = Buffer.from(token, 'base64').toString('utf8') // johndoe@gmail.com:qwerty

        const [email, password] = decoded.split(':')
        const user = await this.userRepository.findByEmail(email)

        if(!user || user.props.password !== password) throw new Error("Wrong credentials")

        return user
    }
}