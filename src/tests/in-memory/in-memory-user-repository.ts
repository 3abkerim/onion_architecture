import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../interfaces/user-repository.interface";

export class InMemoryUserRepository implements IUserRepository {
    public database: User[] = []

    async create(user: User): Promise<void> {
        this.database.push(user)
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.database.find(user => user.props.email === email)
        return user ?? null
    }

    async findById(id: string): Promise<User | null> {
        const user = this.database.find(user => user.props.id === id)
        return user ?? null
    }
}