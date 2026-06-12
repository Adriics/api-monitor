import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

export async function register({ email, password }: { email: string; password: string }) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error('EMAIL_TAKEN')

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: { email, password: hashed },
        select: { id: true, email: true, createdAt: true }
    })
    return user
}

export async function login({ email, password }: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('INVALID_CREDENTIALS')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('INVALID_CREDENTIALS')

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    )
    return token
}