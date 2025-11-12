import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = "clave_super_secreta"; // usa una variable de entorno en producción
const users: any[] = []; // simulación de base de datos temporal

export const registerUser = async (email: string, password: string) => {
  const existing = users.find(u => u.email === email);
  if (existing) throw new Error("El usuario ya existe");

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), email, password: hashed };
  users.push(user);

  return { message: "Usuario registrado correctamente", user: { id: user.id, email: user.email } };
};

export const loginUser = async (email: string, password: string) => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("Usuario no encontrado");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Contraseña incorrecta");

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

  return { message: "Login exitoso", token };
};
