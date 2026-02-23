import mongoose from "mongoose";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const connectDataBase = () => {
  console.log("DB_LOCAL_URL:", process.env.DB_LOCAL_URL);
  mongoose
    .connect(process.env.DB_LOCAL_URL)
    .then((con) => {
      console.log(`MongoDB is connected to the host: ${con.connection.host} `);
      if (process.env.NODE_ENV === "development") {
        mongoose.set("debug", true);
      }
    })
    .catch((err) => console.error(`The error is ${err}`));
};
