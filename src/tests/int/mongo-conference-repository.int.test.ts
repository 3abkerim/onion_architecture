import { Model } from "mongoose"
import { TestApp } from "../e2e/utils/test-app"
import { MongoConference } from "../../infrastructure/database/mongo/mongo-conference"
import { MongoConferenceRepository } from "../../infrastructure/database/mongo/mongo-conference-repository"
import { testConferences } from "../unit/seeds/seeds-conference"
import { Conference } from "../../domain/entities/conference.entity"
import { addDays } from "date-fns"

describe('MongoConferenceRepository', () => {
    let app: TestApp
    let model: Model<MongoConference.ConferenceDocument>
    let repository: MongoConferenceRepository

    beforeEach(async () => {
        app = new TestApp()
        await app.setup()

        model = MongoConference.ConferenceModel;
        model.deleteMany({})
        repository = new MongoConferenceRepository(model)

        const record = new model({
            _id: testConferences.conference.props.id,
            organizerId: testConferences.conference.props.organizerId,
            title: testConferences.conference.props.title,
            startDate: testConferences.conference.props.startDate,
            endDate: testConferences.conference.props.endDate,
            seats: testConferences.conference.props.seats,
        })
        await record.save()
    })

    afterAll(async () => {
        await app.tearDown()
    })

    describe('FindById', () => {
        it('should find a conference corresponding to the ID', async () => {
            const conference = await repository.findById(testConferences.conference.props.id)
            expect(conference!.props).toEqual(testConferences.conference.props)
        })
        it('should return null if conference does not exist', async () => {
            const conference = await repository.findById('non-existing-id')
            expect(conference).toBeNull()
        })
    })

    describe('Create', () => {
        it('should create a new conference', async () => {
            const newConference = new Conference({
                id: 'id-2',
                organizerId: 'organizer-id',
                title: 'Conference 2',
                startDate: addDays(new Date(), 5),
                endDate: addDays(new Date(), 5),
                seats: 100
            })

            await repository.create(newConference)
            const foundConference = await repository.findById('id-2')
            expect(foundConference).not.toBeNull()
        })
    })

    describe('Update', () => {
        it('should update an existing conference', async () => {
            const updatedConference = new Conference({
                ...testConferences.conference.props,
                title: 'Updated conference',
                seats: 150
            })

            await repository.update(updatedConference)

            const foundConference = await repository.findById(testConferences.conference.props.id)
            expect(foundConference!.props.title).toEqual('Updated conference')
            expect(foundConference!.props.seats).toEqual(150)
        })
    })
})