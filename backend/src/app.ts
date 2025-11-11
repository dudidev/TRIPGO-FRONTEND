import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Verificar conexión a la base de datos
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado a la base de datos MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
})();

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
