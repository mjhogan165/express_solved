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

// function isDog(value: unknown): value is Dog {
//   return (value as Dog) !== undefined;
// }
// type Errors = {
//   code: number;
//   msg: string;
// };
type NewDog = {
  age: number;
  description: string;
  breed: string;
  name: string;
};
// const checkTypeErrors = (body: NewDog): Errors => {
// const requiredKeys = [
//   "age",
//   "name",
//   "description",
//   "breed",
// ];
//now we iterate through the required keys and find the key value pair with that key in the object. we just justr use find they donty hqave to go in order i.e find age if it doesnt exsist or is not a string return age must be  astring
//   const getType = <T>(value: T) => {
//     if (typeof value === "string") {
//       const isNumber = !isNaN(parseInt(value));
//       if (isNumber) {
//         return "number";
//       } else return "string";
//     }
//   };
//   const entries = Object.entries(body);
//   for (let index = 0; index < entries.length; index++) {
//     const keyValuePair = entries[index];
//     const key = keyValuePair[0];
//     const valueType = getType(keyValuePair[1]);

//     if (key === "age") {
//       if (valueType !== "number") {
//         return {
//           code: 401,
//           msg: "age should be a number",
//         };
//       }
//     } else if (valueType !== "string") {
//       return {
//         code: 401,
//         msg: `${keyValuePair[0]} should be a string`,
//       };
//     }
//   }

//   return { code: 201, msg: "" };
// };
//function testInput(body: NewDog): string[] {
function testInput<T>(body: T): string[] {
  // const errors = {
  //   code: 400,
  //   msg: "",
  // };
  const errors: string[] = [];
  const requiredFields = [
    ["age", "number"],
    ["name", "string"],
    ["description", "string"],
    ["breed", "string"],
  ];
  if (typeof body !== "object" || body === null) {
    return ["invalid input"];
  } else {
    const inputFields: any = Object.entries(body);
    const inputProps = Object.keys(body);

    for (const reqField of requiredFields) {
      const find = inputProps.find(
        (field) => field === reqField[0]
      );
      // console.log({ reqKey: reqField, find: find })
      if (inputFields.length < requiredFields && !find) {
        errors.push(
          `${reqField[0]} should be a ${reqField[1]}`
        );
      }
      if (!find) {
        errors.push(`${reqField[0]} is not a valid key`);
      }
    }
    for (const [key, value] of inputFields) {
      switch (key) {
        case "age":
          if (typeof value !== "number") {
            errors.push(`${key} should be a number`);
          }
          break;
        case "description" || "name" || "breed":
          if (typeof value !== "string") {
            errors.push(`${key} should be a string`);
          }
          break;
        default:
          errors.push(`${key} is not a valid key`);
          break;
      }
    }
    return errors;
  }
}
// function isNewDog(dog: NewDog): dog is NewDog {
//   return (dog as NewDog) !== undefined;
// }
app.post("/dogs", async (req, res) => {
  const body = req.body;
  const errorCheck = testInput(req.body);
  if (errorCheck.length < 1) {
    const dog = await prisma.dog.create({
      data: {
        name: body.name,
        age: parseInt(body.age),
        description: body.description,
        breed: body.breed,
      },
    });
    return res
      .status(201)
      .send({ msg: "dog created", dog: dog });
  } else return res.status(400).send(errorCheck);
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
