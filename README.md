# TRACKON API

REST API para el dashboard de operaciones logísticas TRACKON. Construida con Node.js, Express y PostgreSQL.

🔗 Frontend: [trackon-dashboard.vercel.app](https://trackon-dashboard.vercel.app)

## Stack

- Node.js + Express.js + TypeScript
- PostgreSQL (Neon) + Prisma ORM
- JWT + bcrypt
- Helmet + express-rate-limit + express-validator
- Deploy: Railway

## Endpoints

**Auth**
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

**Shipments**
GET    /api/shipments
GET    /api/shipments/:id
POST   /api/shipments
PUT    /api/shipments/:id
DELETE /api/shipments/:id

**Vehicles**
GET    /api/vehicles
GET    /api/vehicles/:id
POST   /api/vehicles
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id

**Routes**
GET    /api/routes
GET    /api/routes/:id
POST   /api/routes
PUT    /api/routes/:id
DELETE /api/routes/:id

**Alerts**
GET    /api/alerts
GET    /api/alerts/unread
POST   /api/alerts
PUT    /api/alerts/:id/read
PUT    /api/alerts/read-all
DELETE /api/alerts/:id

**Dashboard**
GET    /api/dashboard

## Correr en local

1. Clona el repositorio
```bash
git clone https://github.com/aldayr935-ux/trackon-api.git
cd trackon-api
```

2. Instala dependencias
```bash
npm install
```

3. Crea un archivo `.env` en la raíz
```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@...neon.tech/neondb?sslmode=require
JWT_SECRET=tu_secret_aqui
JWT_EXPIRES_IN=7d
```

4. Corre las migraciones
```bash
npx prisma migrate deploy
```

5. Poblar la base de datos con datos demo
```bash
npm run seed
```

6. Inicia el servidor
```bash
npm run dev
```

El servidor corre en [http://localhost:3000](http://localhost:3000)

Verifica que esté corriendo en [http://localhost:3000/health](http://localhost:3000/health)

## Scripts

```bash
npm run dev      # Servidor en desarrollo con hot reload
npm run build    # Compilar TypeScript
npm start        # Servidor en producción
npm run seed     # Poblar DB con datos demo
```

## Estructura del proyecto

src/
├── controllers/
│   ├── auth.controller.ts
│   ├── shipments.controller.ts
│   ├── vehicles.controller.ts
│   ├── routes.controller.ts
│   ├── alerts.controller.ts
│   └── dashboard.controller.ts
├── routes/
│   ├── auth.routes.ts
│   ├── shipments.routes.ts
│   ├── vehicles.routes.ts
│   ├── routes.routes.ts
│   ├── alerts.routes.ts
│   └── dashboard.routes.ts
├── middlewares/
│   ├── auth.middleware.ts
│   └── validate.middleware.ts
├── prisma/
│   └── client.ts
└── index.ts
prisma/
├── schema.prisma
└── seed.ts

## Seguridad

- Autenticación con JWT — tokens con expiración configurable
- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Headers de seguridad con Helmet
- Rate limiting — 100 req/15min general, 10 req/15min en auth
- Validación y sanitización de inputs con express-validator
- CORS restringido a orígenes permitidos

## Autor

Aldayr — [ALDACODE](https://aldacode.com)