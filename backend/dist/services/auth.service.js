"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = "clave_super_secreta"; // usa una variable de entorno en producción
const users = []; // simulación de base de datos temporal
const registerUser = async (email, password) => {
    const existing = users.find(u => u.email === email);
    if (existing)
        throw new Error("El usuario ya existe");
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = { id: Date.now(), email, password: hashed };
    users.push(user);
    return { message: "Usuario registrado correctamente", user: { id: user.id, email: user.email } };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = users.find(u => u.email === email);
    if (!user)
        throw new Error("Usuario no encontrado");
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        throw new Error("Contraseña incorrecta");
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    return { message: "Login exitoso", token };
};
exports.loginUser = loginUser;
