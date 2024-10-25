
import { addDays, addHours } from 'date-fns'
import { Application } from 'express'
import request from 'supertest'
import { container } from '../../infrastructure/config/dependency-injection'
import { testConferences } from '../unit/seeds/seeds-conference'
import { e2eConferences } from './seeds/conference-e2e-seed'
import { e2eUsers } from './seeds/user-e2e-seed'
import { TestApp } from './utils/test-app'
import { e2eBookings } from './seeds/booking-e2e-seed'

describe('Usecase: Change Dates', () => {
    const conferenceRepository = container('conferenceRepository')
    const mailer = container('mailer')

    let testApp: TestApp
    let app: Application

    beforeEach(async () => {
        testApp = new TestApp()
        await testApp.setup()
        await testApp.loadFixtures([
            e2eConferences.conference,
            e2eUsers.johnDoe,
            e2eUsers.alice,
            e2eBookings.aliceBooking
        ])
        app = testApp.expressApp
    })

    afterAll(async() => {
        testApp.tearDown()
    })

    it('should change the dates', async () => {
        const startDate = addDays(new Date(), 4)
        const endDate = addDays(addHours(new Date(), 2), 4)

        const response = await request(app)
                                .patch(`/conference/${testConferences.conference.props.id}/dates`)
                                .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                                .send({
                                    startDate, endDate
                                })
        
        expect(response.status).toEqual(200)

        const fetchedConference = await conferenceRepository.findById(testConferences.conference.props.id)

        expect(fetchedConference).toBeDefined()
        expect(fetchedConference!.props.startDate).toEqual(startDate)
        expect(fetchedConference!.props.endDate).toEqual(endDate)

        expect(mailer.sentEmails).toHaveLength(1)
    })
})