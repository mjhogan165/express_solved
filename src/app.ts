import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";
//import { Dog } from "@prisma/client";

const app = express();
app.use(express.json());
// All code should go below this line

app.get("/", (_req, res) => {
  res.json({ message: "Hello World!" }).status(200);
});
app.get("/dogs", async (req, res) => {
  const dogs = await prisma.dog.findMany();
  // console.log(dogs);
  res.status(200).send(dogs);
});

app.get("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  if (!Number.isInteger(id)) {
    res.status(400).send("id should be a number");
  }
  // console.log(id);
  // console.log(req.params);
  return await prisma.dog
    .findMany({
      where: {
        id: id,
      },
    })
    .then((result: any) => {
      console.log(result);
      return result;
      // if (result === null) {
      //   res.status(204).send("not found");
      // }
    });
});

function testInput<T>(body: T): string[] {
  const errors: string[] = [];
  const requiredFields = [
    ["age", "number"],
    ["name", "string"],
    ["description", "string"],
    ["breed", "string"],
  ];
  const reqProps = ["age", "name", "description", "breed"];
  if (typeof body !== "object" || body === null) {
    return ["invalid input"];
  } else {
    const inputFields: any = Object.entries(body);
    const inputProps = Object.keys(body);
    for (const reqField of requiredFields) {
      for (const inputField of inputFields) {
        console.log(inputField);
        if (inputField[0] === reqField[0]) {
          switch (inputField[0]) {
            case "age":
              if (typeof inputField[1] !== "number") {
                errors.push(
                  String.raw`${inputField[0]} should be a numberc`
                );
              }
              break;
            case "description":
              if (typeof inputField[1] !== "string") {
                errors.push(
                  String.raw`${inputField[0]} should be a string`
                );
              }
              break;
            case "breed":
              if (typeof inputField[1] !== "string") {
                errors.push(
                  String.raw`${inputField[0]} should be a string`
                );
              }
              break;
            case "name":
              if (typeof inputField[1] !== "string") {
                errors.push(
                  String.raw`${inputField[0]} should be a string`
                );
              }
              break;
            default:
              console.log(`default on ${inputField}`);
              errors.push(
                String.raw`${inputField[0]} is not a valid key`
              );
              break;
          }
        } else if (
          !reqProps.includes(inputField[0]) &&
          !errors.includes(
            String.raw`${inputField[0]} is not a valid key`
          )
        ) {
          errors.push(
            String.raw`${inputField[0]} is not a valid key`
          );
        }
      }
    }
    if (inputFields.length < requiredFields.length) {
      for (
        let index = 0;
        index < requiredFields.length;
        index++
      ) {
        let missing;
        const current = requiredFields[index];
        const key = current[0];
        const check = inputProps.find((x) => x === key);
        if (!check) {
          missing = key;
          if (missing && missing === "age") {
            errors.push(
              String.raw`${missing} should be a number`
            );
          } else if (missing) {
            errors.push(
              String.raw`${missing} should be a string`
            );
          }
        }
      }
    }
    return errors;
  }
}

app.post("/dogs", async (req, res) => {
  const body = req.body;
  const errorCheck = testInput(req.body);
  const age = parseInt(body.age);
  if (errorCheck.length < 1) {
    await prisma.dog.create({
      data: {
        name: body.name,
        age: age,
        description: body.description,
        breed: body.breed,
      },
    });
    return res.status(201).send("dog created");
  } else return res.status(400).json(errorCheck);
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
