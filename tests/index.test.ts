import { beforeEach, describe, expect, it } from "vitest";
import { clearDb } from "../prisma/clearDb";
import { Dog } from "@prisma/client";
import { seedDogs } from "../prisma/seedDogs";
import { AxiosInstance } from "./helper";

const { get } = AxiosInstance;
describe("GET /dogs", () => {
  let dogs: Dog[];
  beforeEach(async () => {
    await clearDb();
    dogs = (await seedDogs()).dogsArray;
  });

  it("should return all the dogs in the database", async () => {
    const { data } = await get("/dogs");
    expect(data).toEqual(dogs);
  });

  it("should have a status code of 200", async () => {
    const { status } = await get("/dogs");
    expect(status).toEqual(200);
  });
});
