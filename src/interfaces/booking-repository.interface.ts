import { Booking } from "../domain/entities/booking.entity";

export interface IBookingRepository {
    create(booking: Booking): Promise<void>
    findByConferenceId(id: string): Promise<Booking[]>
}