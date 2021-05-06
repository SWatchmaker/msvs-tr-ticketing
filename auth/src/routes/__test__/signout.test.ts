import { app } from "../../app";
import request from "supertest";

it("clears the cookie after signout", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "sebaweidmann@hotmail.com",
      password: "12345",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")).toEqual([
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
  ]);
});
