import { User } from "../../../domain/entities/user.entity";
import { ResolveDependency } from "../../../infrastructure/config/dependency-injection";
import { IFixture } from "../utils/fixture.interface";

export class UserFixture implements IFixture {
    constructor(public entity: User) {}

    async load(container: ResolveDependency): Promise<void> {
        const userRepository = container('userRepository')
        await userRepository.create(this.entity)
    }

    createAuthorizationToken() {
        const token = Buffer.from(`${this.entity.props.email}:${this.entity.props.password}`).toString('base64')
        return `Basic ${token}`
    }

}