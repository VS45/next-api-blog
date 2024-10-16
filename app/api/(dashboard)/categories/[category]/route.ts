import connect from "@/lib/db";
import Category from "@/lib/models/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import User from "@/lib/models/user";
const ObjectId = require("mongoose").Types.ObjectId;

export const PATCH = async (req: Request, constext: { params: any }) => {
  const categoryId = constext.params.category;
  try {
    const { title } = await req.json();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "invalid or missing userId" }),
        { status: 400 }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "invalid or missing categoryId" }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "user not found" }), {
        status: 404,
      });
    }
    const category = await Category.findOne({
      _id: new ObjectId(categoryId),
      user: userId,
    });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category not found" }),
        {
          status: 400,
        }
      );
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: categoryId },
      { title: title },
      { new: true }
    );
    if (!updatedCategory) {
      return new NextResponse(
        JSON.stringify({ message: "Category not updated" }),
        {
          status: 400,
        }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "Category updated", updatedCategory }),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ message: "Category not updated", error: err.message }),
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req: Request, constext: { params: any }) => {
  const categoryId = constext.params.category;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "invalid or missing userId" }),
        { status: 400 }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "invalid or missing categoryId" }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "user not found" }), {
        status: 404,
      });
    }
    const category = await Category.findOne({
      _id: new ObjectId(categoryId),
      user: userId,
    });
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "category not found or does not belong to the user",
        }),
        {
          status: 404,
        }
      );
    }
    const deleteCategory = await Category.findByIdAndDelete(categoryId);
    if (!deleteCategory) {
      return new NextResponse(JSON.stringify({ message: "could not delete" }), {
        status: 404,
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "Category deleted", deleteCategory }),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in deleting category",
        error: err.message,
      }),
      {
        status: 500,
      }
    );
  }
};

