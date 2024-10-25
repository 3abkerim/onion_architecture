import { Conference } from "../../../domain/entities/conference.entity";
import { testUsers } from "./seeds-user";


export const testConferences = {
    conference: new Conference({
        id: 'id-1',
        organizerId: testUsers.johnDoe.props.id,
        title: 'Nouvelle conference',
        startDate: new Date('2024-01-05T10:00:00.000Z'),
        endDate: new Date('2024-01-05T11:00:00.000Z'),
        seats: 50
    })
}