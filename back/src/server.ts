import * as express from "express";
import paciente from "./paciente";
import consulta from "./consulta"


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/pacientes", paciente);
app.use("/consultas", consulta);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
