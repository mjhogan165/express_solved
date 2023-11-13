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

app.get("/dogs/:id", async (req, res, next) => {
  const id = +req.params.id;
  if (!Number.isInteger(id)) {
    res
      .status(400)
      .send({ message: "id should be a number" });
  }
  await prisma.dog
    .findMany({
      where: {
        id: id,
      },
    })
    .then((x) => {
      if (x.length === 0) {
        res.status(204).send();
      } else res.send(x);
    })
    .catch((err) => next(err));
});

app.post("/dogs", async (req, res) => {
  const body = req.body;
  console.log(req.body);
  // const errorCheck = testInput(req.body);
  // // const age = parseInt(body.age);
  // console.log({ age: age });
  const errors: string[] = [];
  let name = req?.body?.name;
  let age = req?.body?.age;
  let description = req?.body?.description;
  let breed = req?.body?.breed;

  if (typeof name !== "string") {
    name = "";
    console.log({ typename: typeof name });
    errors.push("name should be a string");
  }
  if (typeof age !== "number") {
    age = "";
    errors.push("age should be a number");
  }
  if (typeof description !== "string") {
    description = "";
    errors.push("description should be a string");
  }
  if (typeof breed !== "string") {
    breed = "";
    errors.push("breed should be a string");
  }
  const reqKeys = ["name", "age", "description", "breed"];
  const keys = Object.keys(body);
  for (const inputKey of keys) {
    if (!reqKeys.find((key) => key === inputKey)) {
      errors.push(`${inputKey} is not a valid key`);
    }
  }
  console.log({
    name: name,
    age: age,
    breed: breed,
    description: description,
  });
  console.log({ errors: errors, length: errors.length });
  if (errors.length === 0) {
    console.log("creat");
    await prisma.dog.create({
      data: {
        name: body.name,
        age: body.age,
        description: body.description,
        breed: body.breed,
      },
    });
    return res.status(201).send("dog created");
  } else return res.status(400).send(errors);
});

app.patch("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  const name = req?.body?.name;
  const age = req?.body?.age;
  const description = req?.body?.description;
  const breed = req?.body?.breed;
  const errors = [];
  // type update = {
  //   na
  // };
  type UpdateType = {
    name?: string;
    age?: number;
    description?: string;
    breed?: string;
  };
  const update: UpdateType = {};

  const validKeys = Object.keys(update);
  const inputKeys = Object.keys(req.body);
  for (const key of inputKeys) {
    if (!validKeys.includes(key)) {
      errors.push(key);
      res.status(400).send(`${key} is not a valid key`);
    }
  }

  if (name) {
    update.name = name;
  }
  if (age) {
    update.age = age;
  }
  if (description) {
    update.description = description;
  }
  if (breed) {
    update.breed = breed;
  }
  await prisma.dog
    .update({
      where: { id: id },
      data: update,
    })
    .then((x) => {
      if (errors.length === 0 && x) {
        res.status(201).send("dog");
      } else res.status(400).send("no dog");
    })
    .catch((err) => err);
});

app.delete("/dogs/:id", async (req, res, next) => {
  const id = req.params.id;
  const errors = [];
  console.log({ id: id });
  if (typeof id !== "number") {
    errors.push("id must be a number");
  }
  const dog = await prisma.dog
    .delete({
      where: {
        id: +req.params.id,
      },
    })
    .then((value) => {
      console.log({ val: value });
      if (errors.length === 0) {
        res.status(201).send("dog deleted");
      }

      // res.status(201).send("done");
    })
    .catch((err) => {
      // next(err);
      res.status(400).json({ message: "dog not found" });
    });
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
