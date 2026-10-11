import { Schema, model } from "mongoose";

export type CustomerStatus = "active" | "inactive" | "suspended";

export interface Customer {
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<Customer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

export const CustomerModel = model<Customer>("Customer", customerSchema);
