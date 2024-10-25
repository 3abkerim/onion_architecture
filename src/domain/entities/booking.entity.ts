type BookingProps = {
    conferenceId: string
    userId: string
}

export class Booking {
    constructor(public props: BookingProps) {}
}