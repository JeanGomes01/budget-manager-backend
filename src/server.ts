import fastifyCors from "@fastify/cors"; // Importando o novo pacote CORS
import { env } from "process";
import { app } from "./app";

// Define um valor padrão se env.PORT não estiver definido
const port = env.PORT ?? "3333"; // Usa "3333" como padrão se PORT não estiver definido

// Registro do middleware CORS
app.register(fastifyCors, {
  origin: "http://localhost:5173", // Permitir apenas essa origem, ajuste conforme necessário
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
});

app
  .listen({
    port: parseInt(port, 10), // Certifique-se de que o port seja um número
  })
  .then(() => {
    console.log("HTTP Server Running !");
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1); // Encerra o processo se ocorrer um erro
  });
