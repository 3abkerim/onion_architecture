import { Conference } from "../../domain/entities/conference.entity";
import { IConferenceRepository } from "../../interfaces/conference-repository.interface";


export class InMemoryConferenceRepository implements IConferenceRepository {
    public database: Conference[] = []

    async create(conference: Conference) {
        this.database.push(conference)
    }

    async findById(id: string): Promise<Conference | null> {
        const conference = this.database.find(conference => conference.props.id === id)
        return conference ?? null
    }

    async update(conference: Conference): Promise<void> {
        const index = this.database.findIndex(conf => conf.props.id === conference.props.id)
        this.database[index] = conference
    }
}