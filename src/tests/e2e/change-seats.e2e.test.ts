
import { Application } from 'express'
import request from 'supertest'
import { container } from '../../infrastructure/config/dependency-injection'
import { testConferences } from '../unit/seeds/seeds-conference'
import { e2eConferences } from './seeds/conference-e2e-seed'
import { e2eUsers } from './seeds/user-e2e-seed'
import { TestApp } from './utils/test-app'

describe('Usecase: Change Seats', () => {
    const conferenceRepository = container('conferenceRepository')

    let testApp: TestApp
    let app: Application

    beforeEach(async () => {
        testApp = new TestApp()
        await testApp.setup()
        await testApp.loadFixtures([
            e2eConferences.conference,
            e2eUsers.johnDoe
        ])
        app = testApp.expressApp
    })

    afterAll(async() => {
        testApp.tearDown()
    })

    it('should change the number of seats', async () => {
        const response = await request(app)
                                .patch(`/conference/${testConferences.conference.props.id}`)
                                .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                                .send({
                                    seats: 100,
                                })
        
        expect(response.status).toEqual(200)

        const fetchedConference = await conferenceRepository.findById(testConferences.conference.props.id)

        expect(fetchedConference).toBeDefined()
        expect(fetchedConference!.props.seats).toEqual(100)
    })
})