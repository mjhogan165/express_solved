import { clearDb } from "./clearDb";
import { prisma } from "./prisma-instance";

export async function seedDogs() {
  await clearDb();
  const doomslayer = await prisma.dog.create({
    data: {
      name: "Doomslayer",
      breed: "Cowboy Corgi",
      description:
        "Half Corgi, Half Blue Heeler, he's here, and he's ready to RUMBLE!!!",
      age: 2,
    },
  });
  const zoey = await prisma.dog.create({
    data: {
      name: "Zoey",
      breed: "Pit / Lab",
      description:
        "She can be a pain in the butt sometimes but AWWWWWW is she a lil' cutie",
      age: 3,
    },
  });
  const doogie = await prisma.dog.create({
    data: {
      name: "Doogie",
      breed: "Terrier",
      description:
        "Jon's first dog, she was such a little sweetheart",
      age: 4,
    },
  });
  const matty = await prisma.dog.create({
    data: {
      name: "Matty",
      breed: "Mastiff",
      description:
        "Grumpy, yet more precious than anything in the world",
      age: 5,
    },
  });

  return {
    dogsArray: [doomslayer, zoey, doogie, matty],
    dogs: {
      doomslayer,
      zoey,
      doogie,
      matty,
    },
  };
}
