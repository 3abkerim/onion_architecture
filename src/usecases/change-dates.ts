import { Conference } from "../domain/entities/conference.entity"
import { User } from "../domain/entities/user.entity"
import { IBookingRepository } from "../interfaces/booking-repository.interface"
import { IConferenceRepository } from "../interfaces/conference-repository.interface"
import { IDateGenerator } from "../interfaces/date-generator.interface"
import { IExecutable } from "../interfaces/executable.interface"
import { IMailer } from "../interfaces/mailer.interface"
import { IUserRepository } from "../interfaces/user-repository.interface"

type ChangeDatesRequest = {
    user: User
    conferenceId: string
    startDate: Date
    endDate: Date
}

type ChangeDatesResponse = void

export class ChangeDates implements IExecutable<ChangeDatesRequest, ChangeDatesResponse> {

    constructor(
        private readonly conferenceRepository: IConferenceRepository,
        private readonly mailer: IMailer,
        private readonly bookingRepository: IBookingRepository,
        private readonly userRepository: IUserRepository,
        private readonly dateGenerator: IDateGenerator
    ){}

    async execute({user, conferenceId, startDate, endDate}: ChangeDatesRequest): Promise<void> {
        const conference = await this.conferenceRepository.findById(conferenceId)

        if(!conference) throw new Error("Conference not found")
        if(!conference.isTheOrganizer(user)) throw new Error("You are not allowed to change this conference")

        conference!.update({startDate, endDate})

        if(conference.isTooClose(this.dateGenerator.now())) throw new Error("Conference must happen in at least 3 days")
        if(conference.isTooLong()) throw new Error("The conference is too long")

        await this.conferenceRepository.update(conference!)
        await this.sendEmailToParticipants(conference!)
        
    }

    private async sendEmailToParticipants(conference: Conference) {
        const bookings = await this.bookingRepository.findByConferenceId(conference.props.id) // [{userId, conferenceId}, {}]
        const users = await Promise.all(
            bookings.map(booking => this.userRepository.findById(booking.props.userId))
                    .filter(user => user !== null)
        ) as User[]

        await Promise.all(
            users.map(user => {
                this.mailer.send({
                    from: 'TEDx Conference',
                    to: user.props.email,
                    subject: 'Conference dates were updated',
                    body: `The conference with title: ${conference!.props.title} has updated its dates`
                })
            })
        )
    }
}