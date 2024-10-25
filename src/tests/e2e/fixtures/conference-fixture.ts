import { Conference } from "../../../domain/entities/conference.entity";
import { ResolveDependency } from "../../../infrastructure/config/dependency-injection";
import { IFixture } from "../utils/fixture.interface";

export class ConferenceFixture implements IFixture {
    constructor(public entity: Conference) {}

    async load(container: ResolveDependency): Promise<void> {
        const conferenceRepository = container('conferenceRepository')
        await conferenceRepository.create(this.entity)
    }
}