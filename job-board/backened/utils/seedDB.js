import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
//dotenv.config({ path: "./backend_config.env" });
import { connectDataBase } from "../connection/conn.js";
import UserModel from "../models/UserModel.js";
import JobModel from "../models/JobModel.js";
import CompanyModel from "../models/CompanyModel.js";

// dotenv.config({ path: "./backend_config.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__filename);
console.log(__dirname);

dotenv.config({
  path: path.join(__dirname, "../backend_config.env"),
});

connectDataBase();

// Seed Data
const companiesData = [
  {
    id: "FjcJCHJALA4i",
    name: "Facegle",
    description:
      "We are a startup on a mission to disrupt social search engines. Think Facebook meet Google.",
  },
  {
    id: "Gu7QW9LcnF5d",
    name: "Goobook",
    description:
      "We are a startup on a mission to disrupt search social media. Think Google meet Facebook.",
  },
];

const jobsData = [
  {
    id: "f3YzmnBZpK0o",
    companyId: "FjcJCHJALA4i",
    title: "Frontend Developer",
    description: "We are looking for a Frontend Developer familiar with React.",
    // createdAt: new Date("2025-01-26T11:00:00.000Z"),
  },
  {
    id: "XYZNJMXFax6n",
    companyId: "FjcJCHJALA4i",
    title: "Backend Developer",
    description:
      "We are looking for a Backend Developer familiar with Node.js and Express.",
    //createdAt: new Date("2025-01-27T11:00:00.000Z"),
  },
  {
    id: "6mA05AZxvS1R",
    companyId: "Gu7QW9LcnF5d",
    title: "Full-Stack Developer",
    description:
      "We are looking for a Full-Stack Developer familiar with Node.js, Express, and React.",
    // createdAt: new Date("2025-01-30T11:00:00.000Z"),
  },
];

const usersData = [
  {
    id: "AcMJpL7b413Z",
    companyId: "FjcJCHJALA4i",
    email: "alice@facegle.io",
    password: "alice123", // consider hashing in real apps
  },
  {
    id: "BvBNW636Z89L",
    companyId: "Gu7QW9LcnF5d",
    email: "bob@goobook.co",
    password: "bob123",
  },
];

// Seeder Function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await CompanyModel.deleteMany();
    await JobModel.deleteMany();
    await UserModel.deleteMany();
    console.log("Existing data cleared!");

    // Insert new data
    await CompanyModel.insertMany(companiesData);
    console.log("Companies seeded!");

    await JobModel.insertMany(jobsData);
    console.log("Jobs seeded!");

    await UserModel.insertMany(usersData);
    console.log("Users seeded!");

    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error.message);
    process.exit(1);
  }
};

seedDatabase();
