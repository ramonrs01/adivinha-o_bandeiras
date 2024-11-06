let correctCountry;
let options = [];
let continente = document.getElementById('continente').value;
let score = 0; // Contador de acertos

// Função para obter o nome do país em português
function getCountryNameInPortuguese(country) {
    return country.translations && country.translations.por ? country.translations.por.common : country.name.common;
}

// Função para carregar países aleatórios com base no continente selecionado
function getRandomCountries() {
    const continente = document.getElementById('continente').value;
    
    if (continente === 'all') {
        alert("Por favor, selecione um continente.");
        return;
    }

    fetch(`https://restcountries.com/v3.1/region/${continente}`)
    .then(response => response.json())
    .then(data => {
        // Seleciona um país aleatório como o correto
        const randomIndex = Math.floor(Math.random() * data.length);
        correctCountry = data[randomIndex];
        options = [correctCountry];

        // Adiciona mais 3 opções aleatórias de países
        while (options.length < 4) {
            const randomOption = data[Math.floor(Math.random() * data.length)];
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }

        // Embaralha as opções
        options.sort(() => Math.random() - 0.5);

        displayQuestion();
    })
    .catch(error => console.error('Erro:', error));
}

// Função para exibir a pergunta e as opções de resposta
function displayQuestion() {
    // Exibe a bandeira do país correto
    document.getElementById('flagImage').src = correctCountry.flags.png;
    document.getElementById('flagImage').style.display = 'block';
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Limpa as opções anteriores
    
    // Cria botões para as opções de países
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = getCountryNameInPortuguese(option);
        button.classList.add('btn', 'btn-light', 'm-2'); // Adiciona classes de estilo
        button.onclick = () => checkAnswer(option, button); // Passa a referência do botão
        optionsDiv.appendChild(button);
    });

    // Aparece o botão "Próximo"
    document.getElementById('nextButton').style.display = 'none'; // Esconde o botão "Próximo"
    document.getElementById('result').innerHTML = ''; // Limpa a mensagem anterior
}

// Verificar a resposta do usuário
function checkAnswer(selected, button) {
    // Desabilita os botões de resposta
    const buttons = document.querySelectorAll('#options button');
    buttons.forEach(button => button.disabled = true);
    
    const resultDiv = document.getElementById('result');
    
    // se a resposta está correta
    if (selected.name.common === correctCountry.name.common) {
        resultDiv.innerHTML = '<p style="color: green;">Correto!</p>';
        score++; // Incrementa o número de acertos
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O país correto era: ${getCountryNameInPortuguese(correctCountry)}</p>`;
    }
    
    // Exibe o contador de acertos
    document.getElementById('contador').innerHTML = `Acertos: ${score}`;
    
    // Exibe o botão "Próximo"
    document.getElementById('nextButton').style.display = 'block';
}

// Função para carregar uma nova pergunta
document.getElementById('nextButton').onclick = () => {
    document.getElementById('result').innerHTML = ''; // Limpa o resultado anterior
    document.getElementById('nextButton').style.display = 'none'; // Esconde o botão "Próximo"
    getRandomCountries(); // Carrega uma nova bandeira
};

// Função de reset para reiniciar o jogo
function reset() {
    score = 0; // Reinicia o contador de acertos
    document.getElementById('contador').innerHTML = `Acertos: ${score}`;
    getRandomCountries(); // Carrega a primeira bandeira
}


