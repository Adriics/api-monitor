import cron from 'node-cron'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'
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

async function pingMonitor(url: string) {
    const start = Date.now()

    try {
        const response = await axios.get(url, { timeout: 10000 })
        return {
            status: 'UP' as const,
            latencyMs: Date.now() - start,
            statusCode: response.status,
        }
    } catch (error: any) {
        return {
            status:
                error.code === 'ECONNABORTED'
                    ? ('TIMEOUT' as const)
                    : ('DOWN' as const),
            latencyMs: Date.now() - start,
            statusCode: error.response?.status ?? null,
        }
    }
}

async function sendAlert(email: string, monitorName: string, url: string, status: string) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `[api-monitor] ${monitorName} está ${status}`,
        text: `El monitor "${monitorName}" (${url}) ha cambiado a ${status}`,
    })
}

/* =========================
   INCIDENT HANDLER
========================= */
async function handleIncident(monitorId: string, newStatus: string) {
    const openIncident = await prisma.incident.findFirst({
        where: {
            monitorId,
            status: 'OPEN',
        },
        orderBy: { startedAt: 'desc' },
    })

    const isDown = newStatus === 'DOWN' || newStatus === 'TIMEOUT'

    // 🔴 abrir incidente
    if (isDown && !openIncident) {
        await prisma.incident.create({
            data: {
                monitorId,
                status: 'OPEN',
            },
        })

        console.log('🟥 Incident OPEN')
    }

    // 🟢 cerrar incidente
    if (!isDown && openIncident) {
        await prisma.incident.update({
            where: { id: openIncident.id },
            data: {
                status: 'RESOLVED',
                resolvedAt: new Date(),
            },
        })

        console.log('🟩 Incident RESOLVED')
    }
}

/* =========================
   MAIN LOOP
========================= */
async function runChecks() {
    console.log(`[${new Date().toISOString()}] Ejecutando checks...`)

    const monitors = await prisma.monitor.findMany({
        where: { active: true },
    })

    for (const monitor of monitors) {
        const result = await pingMonitor(monitor.url)

        const lastCheck = await prisma.check.findFirst({
            where: { monitorId: monitor.id },
            orderBy: { checkedAt: 'desc' },
        })

        const statusChanged =
            lastCheck && lastCheck.status !== result.status

        // 📧 email solo en cambio de estado
        if (statusChanged && monitor.alertEmail) {
            await sendAlert(
                monitor.alertEmail,
                monitor.name,
                monitor.url,
                result.status
            )

            console.log(
                `📧 Alert sent: ${monitor.name} → ${result.status}`
            )
        }

        // 💾 guardar check
        await prisma.check.create({
            data: {
                monitorId: monitor.id,
                status: result.status,
                latencyMs: result.latencyMs,
                statusCode: result.statusCode,
            },
        })

        // 🚨 incidents
        await handleIncident(monitor.id, result.status)

        console.log(`${monitor.name} → ${result.status} (${result.latencyMs}ms)`)
    }
}

cron.schedule('* * * * *', runChecks)

console.log('Worker iniciado — checks cada minuto')