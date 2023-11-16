import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";
//import { Dog } from "@prisma/client";

const app = express();
app.use(express.json());
app.get("/", (_req, res) => {
  res.json({ message: "Hello World!" }).status(200);
});
app.get("/dogs", async (req, res) => {
  const dogs = await prisma.dog.findMany();
  res.status(200).send(dogs);
});

app.get("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  const errors: Record<string, string> = {};
  if (isNaN(id)) {
    errors.message = "id should be a number";
  }
  if (!errors.message) {
    await prisma.dog
      .findMany({
        where: {
          id: id,
        },
      })
      .then((value) => {
        if (value.length > 0) {
          res.status(200).send(value[0]);
        } else {
          res.status(204).send();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else res.status(400).send(errors);
});

app.post("/dogs", async (req, res) => {
  const body = req.body;
  const errors: string[] = [];
  let name = req?.body?.name;
  let age = req?.body?.age;
  let description = req?.body?.description;
  let breed = req?.body?.breed;

  if (typeof name !== "string") {
    name = "";
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
  const validKeys = ["name", "age", "description", "breed"];
  const inputKeys = Object.keys(req.body);
  for (const key of inputKeys) {
    if (!validKeys.includes(key)) {
      console.log({
        invalidk: key,
        resolve: !validKeys.includes(key),
        err: errors,
      });
      errors.push(`'${key}' is not a valid key`);
    }
  }
  if (errors.length === 0) {
    await prisma.dog.create({
      data: {
        name: body.name,
        age: body.age,
        description: body.description,
        breed: body.breed,
      },
    });
    return res.status(201).send("dog created");
  } else
    return res.status(400).send({
      errors: errors,
      wordOfTheDay: "SuperQuackonator9000",
    });
});

app.patch("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  const name = req?.body?.name;
  const age = req?.body?.age;
  const description = req?.body?.description;
  const breed = req?.body?.breed;
  const errors: string[] = [];
  const update: Record<string, string | number> = {};

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
  const validKeys = Object.keys(update);
  const inputKeys = Object.keys(req.body);
  for (const key of inputKeys) {
    if (!validKeys.includes(key)) {
      errors.push(`'${key}' is not a valid key`);
    }
  }
  await prisma.dog
    .update({
      where: { id: id },
      data: update,
    })
    .then((dog) => {
      if (errors.length === 0 && dog) {
        res.status(201).send(dog);
      } else res.status(400).send({ errors: errors });
    })
    .catch((err) => err);
});

app.delete("/dogs/:id", async (req, res) => {
  const id = +req.params.id;
  const errors: string[] = [];
  if (isNaN(id)) {
    res
      .status(400)
      .send({ message: "id should be a number" });
  }
  if (errors.length === 0) {
    await prisma.dog
      .delete({
        where: {
          id: +req.params.id,
        },
      })
      .then((dog) => {
        res.status(200).send(dog);
      })
      .catch((err) => {
        if (err.code === "P2025") {
          res.status(204).send();
        }
      });
  } else {
    if (errors.length === 1) {
      res.status(400).send(errors[0]);
    } else res.status(400).send({ message: errors });
  }
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
