import { User } from "../domain/entities/user.entity";
import { IConferenceRepository } from "../interfaces/conference-repository.interface";
import { IExecutable } from "../interfaces/executable.interface";

type ReserveSeatRequest = {
  user: User;
  conferenceId: string;
};

type ReserveSeatResponse = void;

export class ReserveSeat implements IExecutable<ReserveSeatRequest, ReserveSeatResponse> {
  constructor(private readonly repository: IConferenceRepository) {}

  async execute({ user, conferenceId }: ReserveSeatRequest): Promise<ReserveSeatResponse> {
    const conference = await this.repository.findById(conferenceId);

    if (!conference) throw new Error("Conference not found");

    if (!conference.hasAvailableSeats()) {
      throw new Error("No seats available");
    }

    conference.reserveSeat();

    await this.repository.update(conference);
  }
}