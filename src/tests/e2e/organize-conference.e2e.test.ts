import { addDays, addHours } from "date-fns";
import { Application } from "express";
import request from "supertest";
import { e2eUsers } from "./seeds/user-e2e-seed";
import { TestApp } from "./utils/test-app";
import amqp from "amqplib";
import { e2eConferences } from "./seeds/conference-e2e-seed";

describe("Usecase: Organize Conference", () => {
  let testApp: TestApp;
  let app: Application;
  let connection: amqp.Connection;
  let channel: amqp.Channel;

  beforeEach(async () => {
    testApp = new TestApp();
    await testApp.setup();
    await testApp.loadFixtures([e2eUsers.johnDoe]);
    app = testApp.expressApp;

    connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue("conference_created", { durable: false });
  });

  afterAll(async () => {
    testApp.tearDown();
    await channel.close();
    await connection.close();
  });

  it("should organize a conference", async () => {
    const response = await request(app)
      .post("/conference")
      .set("Authorization", e2eUsers.johnDoe.createAuthorizationToken())
      .send({
        title: "Ma nouvelle conference",
        seats: 100,
        startDate: addDays(new Date(), 4).toISOString(),
        endDate: addDays(addHours(new Date(), 2), 4).toISOString(),
      });

    expect(response.status).toEqual(201);
    expect(response.body.data).toEqual({ id: expect.any(String) });

    const consumedMessage = await new Promise<any>((resolve) => {
      channel.consume("conference_created", (msg) => {
        if (msg) {
          resolve(JSON.parse(msg.content.toString()));
          channel.ack(msg);
        }
      });
    });

    expect(consumedMessage).toEqual({
      conferenceId: expect.any(String),
      organizerEmail: e2eUsers.johnDoe.entity.props.email,
      title: "Ma nouvelle conference",
      seats: 100,
    });
  });
});
