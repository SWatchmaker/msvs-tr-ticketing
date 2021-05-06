import { app } from "../../app";
import request from "supertest";

it("returns a 201 on succesful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "12345",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "invalidemail",
      password: "12345",
    })
    .expect(400);
});

it("returns a 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "12",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "invalidemail",
    })
    .expect(400);
  return request(app)
    .post("/api/users/signup")
    .send({
      password: "12345",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "12345",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "12345",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "12345",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
