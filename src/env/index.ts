import dotenv from "dotenv";
import "dotenv/config";
import { z } from "zod";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Define o esquema de validação das variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(), // Adicionando verificação para a URL do banco de dados
  JWT_SECRET: z.string().min(1), // A variável JWT_SECRET deve ser uma string não vazia
});

// Valida as variáveis de ambiente
const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables.");
}

// Exporta as variáveis de ambiente validadas
export const env = _env.data;
