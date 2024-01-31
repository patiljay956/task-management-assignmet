// require('dotenv').config({ path: './env' })

import dotenv from "dotenv";
import connectDB from "./db/database.js";
import app from "./app.js";
dotenv.config({
    path: "./.env",
});

//connection to the data base and app init
connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Application Unable to connect with DB: ", error);
            throw error;
        });

        //  app listing to the post 3000
        app.listen(process.env.PORT || 4000, () => {
            console.log(`Server is listen at the port ${process.env.PORT}`);
        });
    })

    .catch((err) => {
        console.log("Connection with DB Failed: ", err);
        process.exit(1);
    });
