import { ChangeSeats } from "../../usecases/change-seats"
import { InMemoryConferenceRepository } from "../in-memory/in-memory-conference-repository"
import { testConferences } from "./seeds/seeds-conference"
import { testUsers } from "./seeds/seeds-user"

describe('Usecase: Change seats', () => {
    let usecase: ChangeSeats
    let repository: InMemoryConferenceRepository

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository()
        await repository.create(testConferences.conference)

        usecase = new ChangeSeats(repository)
    })

    describe('Scenario: Happy path', () => {
        const payload = {
            seats: 100,
            conferenceId: testConferences.conference.props.id,
            user: testUsers.johnDoe
        }

        it('should change the number of seats', async () => {
            await usecase.execute(payload)

            const fetchedConference = await repository.findById(testConferences.conference.props.id)

            expect(fetchedConference).toBeDefined()
            expect(fetchedConference!.props.seats).toEqual(100)
        })
    })
    
    describe('Scenario: Conference does not exist', () => {
        const payload = {
            seats: 100,
            conferenceId: 'non-existing-id',
            user: testUsers.johnDoe
        }

        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow("Conference not found")
        })
    })

    describe('Scenario: Conference has too many seats', () => {
        const payload = {
            seats: 1001,
            conferenceId: testConferences.conference.props.id,
            user: testUsers.johnDoe
        }

        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow("Conference has too many seats")
        })
    })

    describe('Scenario: Conference has not enough seats', () => {
        const payload = {
            seats: 15,
            conferenceId: testConferences.conference.props.id,
            user: testUsers.johnDoe
        }

        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow("Conference has not enough seats")
        })
    })

    describe('Scenario: Change conference seats of someone else', () => {
        const payload = {
            seats: 100,
            conferenceId: testConferences.conference.props.id,
            user: testUsers.bob
        }

        it('should throw an error', async () => {
            await expect(usecase.execute(payload)).rejects.toThrow("You are not allowed to change this conference")
        })
    })
})