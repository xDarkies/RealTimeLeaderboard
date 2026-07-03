import express from "express";
import { Login, Logout, Signup } from "./auth.controller.js";

const Router = express.Router()

Router.post("/signup", Signup);
Router.post("/login", Login)
Router.post("/logout", Logout)

export default Router