import cron from 'node-cron'
import axios from 'axios'
import { PrismaClient } from '../../api/node_modules/@prisma/client'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

async function pingMonitor(monitorId: string, url: string) {
    const start = Date.now()
    try {
        const response = await axios.get(url, { timeout: 10000 })
        const latencyMs = Date.now() - start
        return { status: 'UP' as const, latencyMs, statusCode: response.status }
    } catch (error: any) {
        const latencyMs = Date.now() - start
        if (error.code === 'ECONNABORTED') {
            return { status: 'TIMEOUT' as const, latencyMs, statusCode: null }
        }
        return { status: 'DOWN' as const, latencyMs, statusCode: error.response?.status ?? null }
    }
}

async function sendAlert(email: string, monitorName: string, url: string, status: string) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `[api-monitor] ${monitorName} está ${status}`,
        text: `El monitor "${monitorName}" (${url}) ha cambiado de estado a ${status}.`,
    })
}

async function runChecks() {
    console.log(`[${new Date().toISOString()}] Ejecutando checks...`)

    const monitors = await prisma.monitor.findMany({
        where: { active: true },
    })

    for (const monitor of monitors) {
        const result = await pingMonitor(monitor.id, monitor.url)

        const lastCheck = await prisma.check.findFirst({
            where: { monitorId: monitor.id },
            orderBy: { checkedAt: 'desc' },
        })

        const statusChanged =
            lastCheck && lastCheck.status !== result.status

        if (statusChanged && monitor.alertEmail) {
            console.log(
                `State change: ${monitor.name} ${lastCheck.status} → ${result.status}`
            )

            await sendAlert(
                monitor.alertEmail,
                monitor.name,
                monitor.url,
                result.status
            )
        }

        await prisma.check.create({
            data: {
                monitorId: monitor.id,
                status: result.status,
                latencyMs: result.latencyMs,
                statusCode: result.statusCode,
            },
        })

        console.log(`${monitor.name} → ${result.status} (${result.latencyMs}ms)`)
    }
}

cron.schedule('* * * * *', runChecks)
console.log('Worker iniciado — checks cada minuto')