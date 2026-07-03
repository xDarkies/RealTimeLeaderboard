import "dotenv/config"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { Request, Response } from "express"
import { prisma } from "../database.js"

export const Signup = async (req: Request, res: Response) => {
    try{
    const { username, email, password } = req.body;

    if(!username || !email || !password)
        return res.status(400).json({message: "All fields are required"})

    const hashed = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS!))

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashed
        }
    })

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: "1h"})

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 3600 * 1000
    })

    return res.status(201).json({user: {id: user.id, username: user.username, email: user.email}})
    }catch(error){
        console.error("Error", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export const Login = async (req: Request, res: Response) => {
    try{
        const { email, password} = req.body;

        if(!email || !password)
            return res.status(400).json({message: "All fields are required"})

        const user = await prisma.user.findUnique({
            where: {email}
        })
        if(!user)
            return res.status(401).json({message: "Wrong email or password"})

        const isMatch = bcrypt.compare(password, user.password)
        if(!isMatch)
            return res.status(401).json({message: "Wrong email or password"})

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: "1h"})

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            maxAge: 3600 * 1000
        })

        return res.status(200).json("User logged in")
    }catch(error){
        console.error("Error",error)
        res.status(500).json({message: "Internal server error"})
    }
}