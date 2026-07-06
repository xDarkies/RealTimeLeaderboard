import express from "express";
import { AuthMe, Login, Logout, Signup } from "./auth.controller.js";

const Router = express.Router()

Router.post("/signup", Signup);
Router.post("/login", Login)
Router.post("/logout", Logout)
Router.get("/me", AuthMe)

export default Router