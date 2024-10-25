import { Model } from "mongoose";
import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../interfaces/user-repository.interface";
import { MongoUser } from "./mongo-user";

class UserMapper {
    static toCore(document: MongoUser.UserDocument): User {
        return new User({
            id: document._id,
            email: document.email,
            password: document.password
        })
    }

    static toPersistence(user: User) : MongoUser.UserDocument {
        return new MongoUser.UserModel({
            _id: user.props.id,
            email: user.props.email,
            password: user.props.password
        })
    }
}


export class MongoUserRepository implements IUserRepository {

    constructor(
        private readonly model: Model<MongoUser.UserDocument>
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        const document = await this.model.findOne({email})

        if(!document) return null;

        return UserMapper.toCore(document)
    }

    async findById(id: string): Promise<User | null> {
        const document = await this.model.findById(id)

        if(!document) return null

        return UserMapper.toCore(document)
    }

    async create(user: User): Promise<void> {
        const existingDocument = await this.model.findById(user.props.id)
        if(existingDocument) throw new Error("A document with a same ID already exist")

        await UserMapper.toPersistence(user).save()
    }
}