"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Iniciando seed...");
    // Limpiar datos existentes en orden correcto (por foreign keys)
    await prisma.alert.deleteMany();
    await prisma.shipment.deleteMany();
    await prisma.route.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
    console.log("Datos anteriores eliminados");
    // --- Usuarios ---
    const hashedPassword = await bcryptjs_1.default.hash("demo1234", 10);
    const admin = await prisma.user.create({
        data: {
            name: "Admin Demo",
            email: "demo@trackon.com",
            password: hashedPassword,
            role: "ADMIN",
        },
    });
    const operator = await prisma.user.create({
        data: {
            name: "Luis Morales",
            email: "luis@trackon.com",
            password: hashedPassword,
            role: "OPERATOR",
        },
    });
    console.log("Usuarios creados");
    // --- Vehículos ---
    const vehicles = await Promise.all([
        prisma.vehicle.create({
            data: {
                plate: "TRK-001",
                model: "Kenworth T680",
                year: 2022,
                driver: "R. Peña",
                fuel: 68,
                kmToday: 312,
                cargo: 18.4,
                status: "IN_ROUTE",
            },
        }),
        prisma.vehicle.create({
            data: {
                plate: "TRK-007",
                model: "Freightliner Cascadia",
                year: 2021,
                driver: "M. Torres",
                fuel: 41,
                kmToday: 189,
                cargo: 22.1,
                status: "IN_ROUTE",
            },
        }),
        prisma.vehicle.create({
            data: {
                plate: "TRK-014",
                model: "International LT",
                year: 2020,
                driver: null,
                fuel: 85,
                kmToday: 0,
                cargo: null,
                status: "MAINTENANCE",
            },
        }),
        prisma.vehicle.create({
            data: {
                plate: "TRK-019",
                model: "Peterbilt 579",
                year: 2023,
                driver: "A. Ruiz",
                fuel: 53,
                kmToday: 427,
                cargo: 15.7,
                status: "IN_ROUTE",
            },
        }),
        prisma.vehicle.create({
            data: {
                plate: "TRK-023",
                model: "Volvo FH16",
                year: 2022,
                driver: "J. Salinas",
                fuel: 92,
                kmToday: 0,
                cargo: null,
                status: "AVAILABLE",
            },
        }),
        prisma.vehicle.create({
            data: {
                plate: "TRK-031",
                model: "Kenworth W990",
                year: 2024,
                driver: null,
                fuel: 100,
                kmToday: 0,
                cargo: null,
                status: "AVAILABLE",
            },
        }),
    ]);
    console.log("Vehículos creados");
    // --- Rutas ---
    const routes = await Promise.all([
        prisma.route.create({
            data: {
                name: "Bajío – Occidente",
                origin: "León",
                destination: "Guadalajara",
                distance: 483,
                avgTime: 5.2,
                punctuality: 98,
                efficiency: "ALTA",
                vehicleId: vehicles[0].id,
            },
        }),
        prisma.route.create({
            data: {
                name: "Norte – Centro",
                origin: "Monterrey",
                destination: "CDMX",
                distance: 910,
                avgTime: 9.8,
                punctuality: 91,
                efficiency: "ALTA",
                vehicleId: vehicles[3].id,
            },
        }),
        prisma.route.create({
            data: {
                name: "Centro – Golfo",
                origin: "Puebla",
                destination: "Veracruz",
                distance: 305,
                avgTime: 4.1,
                punctuality: 77,
                efficiency: "MEDIA",
                vehicleId: vehicles[1].id,
            },
        }),
        prisma.route.create({
            data: {
                name: "Centro – Sureste",
                origin: "CDMX",
                destination: "Mérida",
                distance: 1220,
                avgTime: 14.5,
                punctuality: 71,
                efficiency: "MEDIA",
            },
        }),
        prisma.route.create({
            data: {
                name: "Noroeste",
                origin: "Tijuana",
                destination: "Hermosillo",
                distance: 621,
                avgTime: 7.3,
                punctuality: 95,
                efficiency: "ALTA",
            },
        }),
    ]);
    console.log("Rutas creadas");
    // --- Shipments ---
    const shipments = await Promise.all([
        prisma.shipment.create({
            data: {
                trackingCode: "TRK-2847",
                origin: "CDMX",
                destination: "Guadalajara",
                weight: 18.4,
                status: "IN_TRANSIT",
                vehicleId: vehicles[0].id,
                routeId: routes[0].id,
            },
        }),
        prisma.shipment.create({
            data: {
                trackingCode: "TRK-2846",
                origin: "Monterrey",
                destination: "CDMX",
                weight: 15.7,
                status: "IN_TRANSIT",
                vehicleId: vehicles[3].id,
                routeId: routes[1].id,
            },
        }),
        prisma.shipment.create({
            data: {
                trackingCode: "TRK-2845",
                origin: "Puebla",
                destination: "Veracruz",
                weight: 22.1,
                status: "IN_TRANSIT",
                vehicleId: vehicles[1].id,
                routeId: routes[2].id,
            },
        }),
        prisma.shipment.create({
            data: {
                trackingCode: "TRK-2844",
                origin: "León",
                destination: "Querétaro",
                weight: 8.5,
                status: "PENDING",
                vehicleId: vehicles[4].id,
            },
        }),
        prisma.shipment.create({
            data: {
                trackingCode: "TRK-2843",
                origin: "CDMX",
                destination: "Toluca",
                weight: 8.3,
                status: "DELIVERED",
                vehicleId: vehicles[5].id,
            },
        }),
        prisma.shipment.create({
            data: {
                trackingCode: "TRK-2842",
                origin: "Tijuana",
                destination: "Hermosillo",
                weight: 11.2,
                status: "IN_TRANSIT",
                routeId: routes[4].id,
            },
        }),
        prisma.shipment.create({
            data: {
                trackingCode: "TRK-2841",
                origin: "CDMX",
                destination: "Mérida",
                weight: 24.0,
                status: "IN_TRANSIT",
                routeId: routes[3].id,
            },
        }),
    ]);
    console.log("Envíos creados");
    // --- Alertas ---
    await Promise.all([
        prisma.alert.create({
            data: {
                message: "Falla de motor en TRK-014. Unidad retirada de circulación.",
                type: "ERROR",
                shipmentId: null,
                userId: admin.id,
            },
        }),
        prisma.alert.create({
            data: {
                message: "TRK-2845 con 85 min de retraso en ruta Puebla → Veracruz.",
                type: "ERROR",
                shipmentId: shipments[2].id,
                userId: operator.id,
            },
        }),
        prisma.alert.create({
            data: {
                message: "TRK-007 por debajo del 40% de combustible. Recarga en Córdoba.",
                type: "WARNING",
                shipmentId: shipments[2].id,
            },
        }),
        prisma.alert.create({
            data: {
                message: "Mantenimiento preventivo de TRK-031 programado para mañana.",
                type: "INFO",
            },
        }),
        prisma.alert.create({
            data: {
                message: "Ruta Norte – Centro operando con alta eficiencia esta semana.",
                type: "INFO",
                shipmentId: shipments[1].id,
            },
        }),
    ]);
    console.log("Alertas creadas");
    console.log("Seed completado exitosamente");
    console.log("");
    console.log("Cuenta demo:");
    console.log("   Email:    demo@trackon.com");
    console.log("   Password: demo1234");
}
main()
    .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
