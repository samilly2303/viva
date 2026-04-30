const API_URL = 'http://localhost:3000/api/materias';

// Seleciona os elementos do HTML
const gridMaterias = document.getElementById('grid-materias');
const formMateria = document.getElementById('form-materia');

// 1. Função para buscar e exibir as matérias (GET)
async function carregarMaterias() {
    try {
        const resposta = await fetch(API_URL);
        const materias = await resposta.json();
        
        // Limpa a tela
        gridMaterias.innerHTML = '';

        // Cria os cards
        materias.forEach(materia => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Remove espaços e acentos para a classe CSS funcionar
            const statusClass = materia.status.replace(/\s+/g, '');

            card.innerHTML = `
                <h3>${materia.nome}</h3>
                <p><strong>Tema:</strong> ${materia.tema}</p>
                <span class="badge status-${statusClass}">${materia.status}</span>
            `;
            
            gridMaterias.appendChild(card);
        });
    } catch (erro) {
        console.error("Erro ao carregar a API:", erro);
        gridMaterias.innerHTML = '<p style="color:red;">Erro ao carregar matérias. O back-end está rodando?</p>';
    }
}

// 2. Função para adicionar nova matéria (POST)
formMateria.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // Evita recarregar a página

    const nome = document.getElementById('input-nome').value;
    const tema = document.getElementById('input-tema').value;
    const status = document.getElementById('input-status').value;

    const novaMateria = { nome, tema, status };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaMateria)
        });

        // Limpa o formulário e recarrega a lista
        formMateria.reset();
        carregarMaterias();
    } catch (erro) {
        console.error("Erro ao salvar:", erro);
        alert("Não foi possível salvar a matéria.");
    }
});

// Carrega as matérias assim que a página abre
carregarMaterias();