import express from "express";
import { Login, Signup } from "./auth.controller.js";

const Router = express.Router()

Router.post("/signup", Signup);
Router.post("/login", Login)

export default Router