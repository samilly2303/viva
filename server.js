require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let materias = [
    { id: 1, nome: "Matemática", tema: "Trigonometria", status: "Estudando" },
    { id: 2, nome: "História", tema: "Segunda Guerra Mundial", status: "Pendente" },
    { id: 3, nome: "Química", tema: "Tabela Periódica", status: "Concluído" }
];

app.get('/api/materias', (req, res) => {
    res.json(materias);
});

app.post('/api/materias', (req, res) => {
    const { nome, tema, status } = req.body;

    if (!nome || !tema) {
        return res.status(400).json({ erro: "Nome e tema são obrigatórios!" });
    }

    const novaMateria = {
        id: materias.length > 0 ? materias[materias.length - 1].id + 1 : 1,
        nome,
        tema,
        status: status || "Pendente"
    };

    materias.push(novaMateria);
    res.status(201).json(novaMateria);
});

app.delete('/api/materias/:id', (req, res) => {
    const { id } = req.params;
    const inicialLength = materias.length;

    materias = materias.filter(m => m.id !== parseInt(id));

    if (materias.length === inicialLength) {
        return res.status(404).json({ erro: "Matéria não encontrada." });
    }

    res.status(204).send();
});

app.post('/api/ajuda-ia', async (req, res) => {
    const { materia, tema } = req.body;

    const prompt = `
    Olá, você é uma IA que responde perguntas sobre escola.
    
    Regras:
    - Responda de forma simples e didática
    - Resuma o que não for necessário
    - Use linguagem clara (nível estudante)
    - Use caracteres UTF-8 normalmente (acentos, etc)
    - Evite textos muito longos
    
    Pergunta do usuário:
    Matéria: ${materia}
    Tema/Dúvida: ${tema}
    `;

    const modelos = [
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite"
    ];

    try {
        let text = null;

        for (let nomeModelo of modelos) {
            try {
                const model = genAI.getGenerativeModel({
                    model: nomeModelo,
                });

                const result = await model.generateContent(prompt);
                const response = await result.response;
                text = response.text();

                break;
            } catch (error) {
                if (error.status !== 503) {
                    throw error;
                }
            }
        }

        if (!text) {
            return res.status(503).json({
                erro: "IA ocupada no momento. Tente novamente em alguns segundos."
            });
        }

        res.json({ explicacao: text });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            erro: "Erro interno ao processar a IA."
        });
    }
});

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});