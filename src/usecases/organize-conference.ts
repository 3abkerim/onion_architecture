import { Conference } from "../domain/entities/conference.entity";
import { User } from "../domain/entities/user.entity";
import { IConferenceRepository } from "../interfaces/conference-repository.interface";
import { IDateGenerator } from "../interfaces/date-generator.interface";
import { IIDGenerator } from "../interfaces/id-generator.interface";
import { IMessageBroker } from "../interfaces/message-broker.interface";

type OrganizeConferenceRequest = {
  user: User;
  title: string;
  startDate: Date;
  endDate: Date;
  seats: number;
};

type OrganizeConferenceResponse = {
  id: string;
};

export class OrganizeConference {
  //rapid
  constructor(private readonly repository: IConferenceRepository, private readonly idGenerator: IIDGenerator, private readonly dateGenerator: IDateGenerator, private readonly messageBroker: IMessageBroker) {}

  async execute({ user, title, startDate, endDate, seats }: OrganizeConferenceRequest): Promise<OrganizeConferenceResponse> {
    const id = this.idGenerator.generate();

    const conference = new Conference({
      id,
      organizerId: user.props.id,
      title,
      startDate,
      endDate,
      seats,
    });

    if (conference.isTooClose(this.dateGenerator.now())) {
      throw new Error("Conference must happen in at least 3 days");
    }

    if (conference.hasNotEnoughSeats()) {
      throw new Error("Conference has not enough seats");
    }

    if (conference.hasTooManySeats()) {
      throw new Error("Conference has too many seats");
    }

    if (conference.isTooLong()) {
      throw new Error("Conference is too long (> 3 hours)");
    }

    await this.repository.create(conference);
    await this.publishMessage(conference, user);

    return { id };
  }

  private async publishMessage(conference: Conference, user: User) {
    if (!this.messageBroker.isConnected()) await this.messageBroker.connect();
    await this.messageBroker.publish("conference_created", {
      conferenceId: conference.props.id,
      organizerEmail: user.props.email,
      title: conference.props.title,
      seats: conference.props.seats,
    });
    if (this.messageBroker.isConnected()) await this.messageBroker.close();
  }
}
