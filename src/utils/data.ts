import { auth } from "./auth";
import { prisma } from "./connct";

//get user by userId
export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error("You are not logged in!");
    }
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("User get by userId failed!!");
  }
};

//get user by username
export const getUserByUsername = async (username: string) => {
  const session = await auth();
  try {
    if (!session || !session.user) {
      throw new Error("You are not logged in!");
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        followers: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("User not found!");
    }
    const { password, ...others } = user;
    return others;
  } catch (error) {
    throw new Error("User get by username failed!");
  }
};
