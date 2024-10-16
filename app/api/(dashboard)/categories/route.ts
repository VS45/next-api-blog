import connect from "@/lib/db";
import Category from "@/lib/models/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import User from "@/lib/models/user";
const ObjectId = require("mongoose").Types.ObjectId;
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "invalid or missing userid" }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "user not found in the database" }),
        { status: 400 }
      );
    }
    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });
    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (err: any) {
    return new NextResponse(
      `Error occurred! in fetching categories ${err.message}`,
      {
        status: 500,
      }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { title } = await request.json();
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "invalid or missing userid" }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "user not found in the database" }),
        { status: 400 }
      );
    }
    const category = await Category.create({
      title,
      user: new Types.ObjectId(userId),
    });
    return new NextResponse(
      JSON.stringify({
        message: "category is successfully created",
        data: category,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse(
      `Error occurred! in creating category ${err.message}`,
      {
        status: 500,
      }
    );
  }
};
