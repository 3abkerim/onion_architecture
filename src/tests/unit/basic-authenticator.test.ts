import { BasicAuthenticator } from "../../infrastructure/authenticators/basic-authenticator"
import { InMemoryUserRepository } from "../in-memory/in-memory-user-repository"
import { testUsers } from "./seeds/seeds-user"

describe('Authenticator', () => {
    let userRepository: InMemoryUserRepository
    let authenticator: BasicAuthenticator

    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        await userRepository.create(testUsers.johnDoe)

        authenticator = new BasicAuthenticator(userRepository)
    })

    describe('Scenario: token is valid', () => {
        const payload = Buffer.from(`${testUsers.johnDoe.props.email}:${testUsers.johnDoe.props.password}`).toString('base64')

        it('should return a user', async () => {
            const user = await authenticator.authenticate(payload)
    
            expect(user!.props).toEqual({
                id: 'john-doe',
                email: 'johndoe@gmail.com',
                password: 'qwerty'
            })
        })
    })

    describe('Scenario: token is not valid', () => {
        const payload = Buffer.from(`unknown@gmail.com:${testUsers.johnDoe.props.password}`).toString('base64')
        it('should throw an error', async () => {
            await expect(authenticator.authenticate(payload)).rejects.toThrow('Wrong credentials')
        })
    })

    describe('Scenario: password is not valid', () => {
        const payload = Buffer.from(`${testUsers.johnDoe.props.email}:azerty`).toString('base64')
        it('should throw an error', async () => {
            await expect(authenticator.authenticate(payload)).rejects.toThrow('Wrong credentials')
        })
    })
})