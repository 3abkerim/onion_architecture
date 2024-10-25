import { addDays, addHours } from "date-fns";
import { Conference } from "../../../domain/entities/conference.entity";
import { ConferenceFixture } from "../fixtures/conference-fixture";
import { e2eUsers } from "./user-e2e-seed";

export const e2eConferences = {
    conference: new ConferenceFixture(
        new Conference({
            id: 'id-1',
            organizerId: e2eUsers.johnDoe.entity.props.id,
            title: 'Ma nouvelle conference',
            startDate: addDays(new Date(), 4),
            endDate: addDays(addHours(new Date(), 2), 4),
            seats: 50
        })
    )
}