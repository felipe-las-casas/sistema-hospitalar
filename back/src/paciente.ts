import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { nomeCompleto, cpf, celular } = req.body;

  if (!nomeCompleto || !cpf || !celular) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const paciente = await prisma.paciente.create({
      data: { nomeCompleto, cpf, celular },
    });

    return res.status(201).json(paciente);
  } catch (error) {
    console.error("Erro ao criar paciente:", error);
    return res.status(500).json({ error: "Erro ao cadastrar paciente" });
  }
});

router.get("/", async (req, res) => {
    try {
      const pacientes = await prisma.paciente.findMany();
      return res.status(200).json(pacientes);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      return res.status(500).json({ error: "Erro ao buscar pacientes" });
    }
  });

  // Buscar paciente por ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await prisma.paciente.findUnique({
        where: { id },
        include: { consultas: true },
        });

        if (!paciente) {
        return res.status(404).json({ error: "Paciente não encontrado." });
        }

        res.json(paciente);
    } catch (error) {
        console.error(error); // Log do erro detalhado
        res.status(500).json({ error: "Erro ao buscar paciente." });
    }
    }
  );
  
  // Atualizar paciente
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nomeCompleto, celular } = req.body;
    try {
      const paciente = await prisma.paciente.update({
        where: { id },
        data: { nomeCompleto, celular },
      });
      res.json(paciente);
    } catch {
      res.status(400).json({ error: "Erro ao atualizar paciente." });
    }
  });
  
  // Deletar paciente
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.paciente.delete({ where: { id } });
      res.json({ message: "Paciente deletado com sucesso." });
    } catch {
      res.status(400).json({ error: "Erro ao deletar paciente." });
    }
  });
  

export default router;
