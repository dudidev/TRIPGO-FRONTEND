import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre_usuario, correo_usuario, password_u, rol } = req.body;

    // Validar campos requeridos
    if (!nombre_usuario || !correo_usuario || !password_u) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const [existing]: any = await pool.execute(
      "SELECT * FROM usuarios WHERE correo_usuario = ?",
      [correo_usuario]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password_u, 10);

    // Insertar nuevo usuario
    await pool.query(
      "INSERT INTO usuarios (nombre_usuario, correo_usuario, password_u, rol) VALUES (?, ?, ?, ?)",
      [nombre_usuario, correo_usuario, hashedPassword, rol || "usuario"]
    );

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { correo_usuario, password_u } = req.body;

    if (!correo_usuario || !password_u) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
    }

    // Buscar usuario
    const [rows]: any = await pool.query(
      "SELECT * FROM usuarios WHERE correo_usuario = ?",
      [correo_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password_u, user.password_u);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, correo: user.correo_usuario, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
        correo_usuario: user.correo_usuario,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el inicio de sesión" });
  }
};
