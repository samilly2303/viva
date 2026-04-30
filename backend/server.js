const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Permite que o Front-end (Chrome) converse com o Back-end
app.use(cors());
// Permite que a API entenda dados em formato JSON
app.use(express.json());

// Nosso banco de dados simulado em memória
let materias = [
    { id: 1, nome: "Matemática", tema: "Trigonometria", status: "Estudando" },
    { id: 2, nome: "História", tema: "Segunda Guerra Mundial", status: "Pendente" },
    { id: 3, nome: "Química", tema: "Tabela Periódica", status: "Concluído" }
];

// Rota GET: Retorna todas as matérias
app.get('/api/materias', (req, res) => {
    res.json(materias);
});

// Rota POST: Adiciona uma nova matéria
app.post('/api/materias', (req, res) => {
    const novaMateria = {
        id: materias.length + 1,
        nome: req.body.nome,
        tema: req.body.tema,
        status: req.body.status || "Pendente"
    };
    materias.push(novaMateria);
    res.status(201).json(novaMateria);
});

app.listen(PORT, () => {
    console.log(`✅ API rodando em http://localhost:${PORT}`);
});