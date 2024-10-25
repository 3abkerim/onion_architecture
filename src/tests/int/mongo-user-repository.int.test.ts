import { Model } from "mongoose"
import { MongoUser } from "../../infrastructure/database/mongo/mongo-user"
import { MongoUserRepository } from "../../infrastructure/database/mongo/mongo-user-repository"
import { TestApp } from "../e2e/utils/test-app"
import { testUsers } from "../unit/seeds/seeds-user"


describe('MongoUserRepository Integration', () => {
    let app: TestApp
    let model: Model<MongoUser.UserDocument>
    let repository: MongoUserRepository

    beforeEach(async () => {
        app = new TestApp()
        await app.setup()

        model = MongoUser.UserModel
        await model.deleteMany({})
        repository = new MongoUserRepository(model)

        const record = new model({
            _id: testUsers.alice.props.id,
            email: testUsers.alice.props.email,
            password: testUsers.alice.props.password
        })

        await record.save()
    })

    afterAll(async () => {
        await app.tearDown()
    })

    describe('findByEmail', () => {
        it('should return an user corresponding to the email', async () => {
            const user = await repository.findByEmail(testUsers.alice.props.email)
            expect(user!.props).toEqual(testUsers.alice.props)
        })

        it('should return null if user not existing', async () => {
            const user = await repository.findByEmail('non-existing@gmail.com')
            expect(user).toBeNull()
        })
    })

    describe('findById', () => {
        it('should return an user corresponding to the id', async () => {
            const user = await repository.findById(testUsers.alice.props.id)
            expect(user!.props).toEqual(testUsers.alice.props)
        })
    })

    describe('create', () => {
        it('should insert an user in the collection', async () => {
            await repository.create(testUsers.bob)

            const foundUser = await model.findOne({_id: testUsers.bob.props.id})

            expect(foundUser!.toObject()).toEqual({
                _id: testUsers.bob.props.id,
                email: testUsers.bob.props.email,
                password: testUsers.bob.props.password,
                __v: 0
            })
        })
    })
})