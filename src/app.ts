import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";
import { Dog } from "@prisma/client";

const app = express();
app.use(express.json());
// All code should go below this line

app.get("/", (_req, res) => {
  res.json({ message: "Hello World!" }).status(200);
});
app.get("/dogs", async (req, res) => {
  const dogs = await prisma.dog.findMany();
  console.log(dogs);
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
    .then((result) => {
      console.log(result);
      return result;
      // if (result === null) {
      //   res.status(204).send("not found");
      // }
    });
});

function isDog(value: unknown): value is Dog {
  return (value as Dog) !== undefined;
}
app.post("/dogs", async (req, res) => {
  console.log(req.body);
  const body = req.body;
  console.log(body);
  console.log(isDog(body));

  const entries = Object.entries(body);
  for (let index = 0; index < entries.length; index++) {
    const element = entries[index];
    if (element[0] === "age") {
      if (!Number.isInteger(element[0])) {
        return res
          .status(400)
          .send("age should be a number");
      }
    } else {
      if (!(typeof element[1] === "string")) {
        return res
          .status(400)
          .send(`${element[0]} should be a string`);
      }
    }
  }

  const dog = await prisma.dog.create({
    data: {
      name: body.name,
      age: body.age,
      description: body.description,
      breed: body.breed,
    },
  });
  return res
    .status(201)
    .send({ msg: "dog created", dog: dog });
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
