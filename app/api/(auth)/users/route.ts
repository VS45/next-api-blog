import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
const ObjectId = require("mongoose").Types.ObjectId;
export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (err: any) {
    return new NextResponse(
      `Error occurred! in fetching users ${err.message}`,
      {
        status: 500,
      }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const { username, email, password } = await request.json();
    await connect();
    const user = await User.create({ email, username, password });
    return new NextResponse(JSON.stringify(user), { status: 201 });
  } catch (err: any) {
    return new NextResponse(`Error occurred creating user ${err.message}`, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const { newUsername, userId } = await request.json();
    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(JSON.stringify(`ID or new username not found`), {
        status: 400,
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify(`wrong user Id format`), {
        status: 400,
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );
    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 400 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "user updated", user: updatedUser }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse(`Error occurred updating user ${err.message}`, {
      status: 500,
    });
  }
};
