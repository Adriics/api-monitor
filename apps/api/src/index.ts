import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import monitorsRoutes from './routes/monitors.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.use('/auth', authRoutes)
app.use('/monitors', monitorsRoutes)

app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`)
})