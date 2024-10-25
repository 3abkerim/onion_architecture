import { differenceInDays, differenceInHours } from "date-fns"
import { User } from "./user.entity"

type ConferenceProps = {
    id: string
    organizerId: string
    title: string
    startDate: Date
    endDate: Date
    seats: number
    reservedSeats: number
}

export class Conference {
    constructor(
        public props: ConferenceProps
    ) {}

    hasAvailableSeats(): boolean {
        return this.props.reservedSeats < this.props.seats;
    }

    reserveSeat(): void {
        if (!this.hasAvailableSeats()) {
          throw new Error("No seats available");
        }
        this.props.reservedSeats += 1;
      }

    hasLessSeatsThanReserved(newSeats: number): boolean {
        return newSeats < this.props.reservedSeats;
    }

    isTooClose(now: Date) {
        return differenceInDays(this.props.startDate, now) < 3
    }

    hasNotEnoughSeats(newSeats: number): boolean {
        return newSeats < 20;
    }

    hasTooManySeats(newSeats: number): boolean {
        return newSeats > 1000;
    }

    isTooLong() {
        return differenceInHours(this.props.endDate, this.props.startDate) > 3
    }

    isTheOrganizer(user: User) {
        return this.props.organizerId === user.props.id
    }

    update(data: Partial<ConferenceProps>) {
        this.props = {...this.props, ...data}
    }
}