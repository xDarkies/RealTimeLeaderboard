import "dotenv/config"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { Request, Response } from "express"
import { Prisma } from "../generated/prisma/client.js"
import { prisma } from "../database.js"

const isProduction = process.env.NODE_ENV === "production"
const jwtSecret = process.env.JWT_SECRET
const saltRounds = Number(process.env.SALT_ROUNDS ?? 10)

if (!jwtSecret) {
    throw new Error("JWT_SECRET must be set")
}

if (!Number.isInteger(saltRounds) || saltRounds < 4) {
    throw new Error("SALT_ROUNDS must be a valid integer")
}

const signToken = (user: { id: string; username: string }) =>
    jwt.sign({ userId: user.id, username: user.username }, jwtSecret, { expiresIn: "1h" })

export const Signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const hashed = await bcrypt.hash(password, saltRounds)

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashed
            }
        })

        const token = signToken(user)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
            maxAge: 3600 * 1000
        })

        return res.status(201).json({ user: { id: user.id, username: user.username, email: user.email } })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return res.status(409).json({ error: "An account with this email or username already exists" })
        }

        console.error("Error", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(401).json({ error: "Wrong email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: "Wrong email or password" })
        }

        const token = signToken(user)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
            maxAge: 3600 * 1000
        })

        return res.status(200).json({ user: { id: user.id, username: user.username, email: user.email } })
    } catch (error) {
        console.error("Error", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const Logout = async (_req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
    })

    return res.status(200).json({ message: "User logged out" })
}

export const AuthMe = async (req: Request, res: Response) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload
        const userId = decoded.userId as string | undefined

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        return res.status(200).json({ user: { id: user.id, username: user.username, email: user.email } })
    } catch (error) {
        console.error("Error", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}