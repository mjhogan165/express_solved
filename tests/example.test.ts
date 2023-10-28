import { describe, expect, it } from "vitest";
import { AxiosInstance } from "./helper";

const { get } = AxiosInstance;
describe("/", () => {
  it("should return an object with the message: 'Hello World!'", async () => {
    const { data } = await get("/");
    expect(data).toEqual({ message: "Hello World!" });
  });
  it("should have a status code of 200", async () => {
    const { status } = await get("/");
    expect(status).toEqual(200);
  });
});
