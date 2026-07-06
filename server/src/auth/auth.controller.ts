import "dotenv/config"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { Request, Response } from "express"
import { prisma } from "../database.js"

const isProduction = process.env.NODE_ENV === "production"

export const Signup = async (req: Request, res: Response) => {
    try{
    const { username, email, password } = req.body;

    if(!username || !email || !password)
        return res.status(400).json({error: "All fields are required"})

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
        secure: isProduction,
        maxAge: 3600 * 1000
    })

    return res.status(201).json({user: {id: user.id, username: user.username, email: user.email}})
    }catch(error){
        console.error("Error", error)
        res.status(500).json({error: "Internal server error"})
    }
}

export const Login = async (req: Request, res: Response) => {
    try{
        const { email, password} = req.body;

        if(!email || !password)
            return res.status(400).json({error: "All fields are required"})

        const user = await prisma.user.findUnique({
            where: {email}
        })
        if(!user)
            return res.status(401).json({error: "Wrong email or password"})
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
            return res.status(401).json({error: "Wrong email or password"})

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: "1h"})

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
            maxAge: 3600 * 1000
        })

        return res.status(200).json( { user: {id: user.id, username: user.username, email: user.email} } )
    }catch(error){
        console.error("Error",error)
        res.status(500).json({error: "Internal server error"})
    }
}

export const Logout = async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
    })

    return res.status(200).json( { message: "User logged out" } )
}

export const AuthMe = async (req: Request, res: Response) => {
    const token = req.cookies.token;

    if(!token)
        return res.status(401).json({message: "Unauthorized"})
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
        const userId = decoded.userId as string | undefined

        if(!userId)
            return res.status(401).json({message: "Unauthorized"})

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if(!user)
            return res.status(401).json({message: "Unauthorized"})

        res.status(200).json({ user: { id: user.id, username: user.username, email: user.email } })
    }catch(error){
        console.error("Error",error)
        res.status(500).json({error: "Internal server error"})
    }
}