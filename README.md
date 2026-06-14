# 📡 api-monitor

Fullstack SaaS de monitorización de APIs con alertas, métricas y sistema de incidentes.

---

## 🚀 Qué es

api-monitor es una herramienta tipo **UptimeRobot / Better Stack**, que permite monitorizar endpoints HTTP, detectar caídas y generar incidentes automáticamente con alertas por email.

---

## 🧱 Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Auth
- bcrypt

### Frontend
- Next.js (App Router)
- TypeScript
- React Query
- Recharts

### Worker
- Node.js
- node-cron
- axios
- Nodemailer

---

## ⚙️ Arquitectura
apps/
├── api → REST API (Express)
├── worker → monitorización + checks + alertas
└── frontend → dashboard en Next.js


---

## 🔁 Cómo funciona

1. El usuario crea un monitor (URL + intervalo)
2. El worker ejecuta checks cada X minutos
3. Se mide:
   - estado HTTP
   - latencia
4. Se guarda en `Check`
5. Si cambia el estado:
   - se crea un `Incident`
   - se envía email de alerta
6. El frontend muestra:
   - estado actual
   - uptime %
   - latencia media
   - incidentes

---

## 📊 Features

### Monitores
- Crear / editar / eliminar endpoints
- Activar/desactivar monitorización

### Checks
- Ping HTTP automático
- Timeout handling
- Latencia por request

### Incidentes
- Creación automática al detectar fallos
- Estado OPEN / RESOLVED
- Historial de caídas

### Métricas
- Uptime %
- Latencia media
- Número de checks
- Estado en tiempo real

### Alertas
- Email automático cuando hay caída o recuperación

---

## 🧠 Worker

El worker es el corazón del sistema:

- ejecuta checks cada minuto
- calcula estado UP / DOWN / TIMEOUT
- detecta cambios de estado
- crea incidents automáticamente
- envía alertas por email

---

## 📈 Ejemplo de métricas

- Google API
- Status: UP
- Uptime: 99.8%
- Avg latency: 180ms
- Checks: 120


---

## 🚨 Sistema de incidentes

Un incidente se crea cuando un monitor cambia de estado a DOWN.

Se cierra cuando vuelve a UP.

Esto permite:

- historial real de caídas
- duración de incidentes
- análisis de estabilidad

---

## 🖥️ Frontend

Incluye:

- Dashboard global de monitores
- Página de detalle por monitor
- Página de incidentes
- Gráficas de latencia
- Estados visuales (verde / rojo / amarillo)

---

## 🖼️ Screenshots

- Dashboard global
![Dashboard](./public/dashboard.png)
- Monitor detail
![Dashboard](./public/monitor-detail.png)
- Incidents page
![Dashboard](./public/incidents.png)

---

## 🧩 Decisiones de arquitectura

- Separación en 3 apps (api / worker / frontend)
- Prisma como única fuente de verdad de datos
- Worker independiente para escalabilidad
- Incidents como capa de negocio, no solo logs
- Uptime calculado a partir de histórico de checks

---

## 📌 Estado del proyecto

✔ Core funcional completo  
✔ Sistema de monitorización real  
✔ Sistema de incidentes  
✔ Métricas de uptime y latencia  
✔ Dashboard funcional  

---

## 🔮 Posibles mejoras

- WebSockets para realtime updates
- Status page pública
- Multi-tenant SaaS
- Alertas por Slack / Discord
- Deploy completo en producción

---

## 👨‍💻 Autor

Proyecto desarrollado como portfolio fullstack para demostrar arquitectura SaaS real.

---