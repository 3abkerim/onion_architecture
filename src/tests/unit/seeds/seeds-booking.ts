import { Booking } from "../../../domain/entities/booking.entity";
import { testConferences } from "./seeds-conference";
import { testUsers } from "./seeds-user";


export const testBookings = {
    aliceBooking: new Booking({
        conferenceId: testConferences.conference.props.id,
        userId: testUsers.alice.props.id
    })
}