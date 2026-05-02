import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(cors({origin: ENV.FRONTEND_URL})); // allow requests from frontend running on port 5173
app.use(clerkMiddleware()); // auth obj will be attached to req.auth
app.use(express.json()); // parses JSON request bodies and makes them available under req.body
app.use(express.urlencoded({ extended: true })); // parses URL-encoded request bodies and makes them available under req.body (like HTML form submissions)

app.get("/", (req, res) => {
    res.json({ 
        message: "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            comments: "/api/comments",
        },
    });
});

app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));