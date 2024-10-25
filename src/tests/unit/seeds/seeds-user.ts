import { User } from "../../../domain/entities/user.entity";

export const testUsers = {
    johnDoe: new User({
        id: 'john-doe',
        email: 'johndoe@gmail.com',
        password: 'qwerty'
    }),
    bob: new User({
        id: 'bob',
        email: 'bob@gmail.com',
        password: 'qwerty'
    }),
    alice: new User({
        id: 'alice',
        email: 'alice@gmail.com',
        password: 'qwerty'
    })
}