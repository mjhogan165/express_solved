import { seedDogs } from "./seedDogs";

seedDogs()
  .then(() => {
    console.log("seeded 🌱");
  })
  .catch((e) => {
    console.error("error seeding 🌱");
    console.error(e);
  });
