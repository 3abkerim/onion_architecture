import { User } from "../../../domain/entities/user.entity";
import { UserFixture } from "../fixtures/user-fixture";

export const e2eUsers = {
    johnDoe: new UserFixture(
        new User({
            id: 'john-doe',
            email: 'johndoe@gmail.com',
            password: 'qwerty'
        })
    ),
    alice: new UserFixture(
        new User({
            id: 'alice',
            email: 'alice@gmail.com',
            password: 'qwerty'
        })
    )
}