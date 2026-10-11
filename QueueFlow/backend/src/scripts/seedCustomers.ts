import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { env } from "../config/env.js";
import { CustomerModel, type CustomerStatus } from "../models/Customer.js";

const firstNames = [
  "Aarav",
  "Aisha",
  "Amelia",
  "Arjun",
  "Charlotte",
  "Daniel",
  "Emma",
  "Ethan",
  "Grace",
  "Ishaan",
  "Jack",
  "Jane",
  "Leo",
  "Maya",
  "Noah",
  "Olivia",
  "Priya",
  "Ravi",
  "Sofia",
  "Thomas",
];

const lastNames = [
  "Adams",
  "Brown",
  "Cooper",
  "Davis",
  "Evans",
  "Garcia",
  "Gupta",
  "Harris",
  "Johnson",
  "Khan",
  "Lee",
  "Martin",
  "Patel",
  "Rai",
  "Sharma",
  "Singh",
  "Smith",
  "Taylor",
];

const companies = [
  "Acme Ltd",
  "Northstar Labs",
  "BluePeak Systems",
  "Evergreen Retail",
  "Horizon Media",
  "Atlas Consulting",
  "Vertex Health",
  "Riverstone Finance",
  "Summit Logistics",
  "CloudNine Studio",
  "BrightPath Education",
  "Oakline Foods",
];

const statuses: CustomerStatus[] = ["active", "active", "active", "inactive", "suspended"];

function makeCustomers(count: number) {
  const now = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length] ?? "Customer";
    const lastName = lastNames[(index * 7) % lastNames.length] ?? "User";
    const company = companies[(index * 5) % companies.length] ?? "Example Co";
    const suffix = String(index + 1).padStart(2, "0");

    return {
      name: `${firstName} ${lastName}`,
      email: `${firstName}.${lastName}.${suffix}@example.com`.toLowerCase(),
      company,
      status: statuses[index % statuses.length] ?? "active",
      createdAt: new Date(now - index * 1000 * 60 * 60 * 18),
      updatedAt: new Date(now - index * 1000 * 60 * 60 * 3),
    };
  });
}

async function seed(): Promise<void> {
  if (env.NODE_ENV === "production") {
    throw new Error("Refusing to seed while NODE_ENV=production");
  }

  await connectDatabase();

  await CustomerModel.deleteMany({});
  const customers = makeCustomers(72);
  await CustomerModel.insertMany(customers);

  console.log(`Seeded ${customers.length} development customers.`);
}

seed()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
