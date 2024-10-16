import { Schema, model, models } from "mongoose";

const categorySchema = new Schema(
  {
    title: { type: String, require: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model("Category", categorySchema);
export default Category;
