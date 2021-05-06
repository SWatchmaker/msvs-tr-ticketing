import { app } from "../../app";
import request from "supertest";

it("fails when a email that doesnt exist is supplied", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "1234",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "12345",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "1234",
    })
    .expect(400);
});

it("response with a cooke when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "12345",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "12345",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
