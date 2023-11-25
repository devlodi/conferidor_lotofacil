document.addEventListener("DOMContentLoaded", function() {
    var fileInput = document.getElementById('file-input');
    var jogosTextarea = document.getElementById('jogos-textarea');
    var resultadoInput = document.getElementById('resultado');
    var resultadoContainer = document.getElementById('resultado-conferencia');
    var togglePremiacaoBtn = document.getElementById('togglePremiacao'); // Botão de alternância
    var exibirTodosAcertos = false; // Estado inicial, exibe somente de 11 a 15

    fileInput.addEventListener('change', function() {
        var file = fileInput.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                jogosTextarea.value = e.target.result;
                conferirJogos();
            };
            reader.readAsText(file);
            fileInput.value = ''; // Limpa o valor do input após a leitura
        }
    });

    togglePremiacaoBtn.addEventListener('click', function() {
        exibirTodosAcertos = !exibirTodosAcertos; // Inverte o estado de exibição
        conferirJogos(); // Atualiza a exibição da tabela
    });

    resultadoInput.addEventListener('input', conferirJogos);
    jogosTextarea.addEventListener('input', conferirJogos);



    // Insere o botão acima da tabela de acertos
    function inserirBotaoVisualizacao() {
        var botaoVisualizacao = document.createElement('button');
        botaoVisualizacao.id = 'togglePremiacao';
        botaoVisualizacao.className = 'toggle-premiacao';
        botaoVisualizacao.textContent = '👁 0 a 15';
        botaoVisualizacao.onclick = function() {
            exibirTodosAcertos = !exibirTodosAcertos;
            conferirJogos();
        };
        
        // Insere o botão no container, antes da tabela de premiação
        resultadoContainer.insertBefore(botaoVisualizacao, resultadoContainer.firstChild);
    }


    function conferirJogos() {
        // Primeiro limpa o conteúdo anterior
        resultadoContainer.innerHTML = '';

        var jogos = jogosTextarea.value.trim().split('\n').map(function(jogo) {
            return jogo.trim().split(/\s+/).map(Number);
        });
        var resultado = resultadoInput.value.trim().split(/\s+/).map(Number);

        // Inicializa a contagem de premiação
       var premiacao = {
             0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
             11: 0, 12: 0, 13: 0, 14: 0, 15: 0
        };

        // Cria a tabela de resultados dos jogos
        var tabelaJogos = document.createElement('table');
        tabelaJogos.innerHTML = '<tr><th>Jogo</th><th>Acertos</th><th>DZ/Por jogos</th><th>Números Acertados</th></tr>';

        jogos.forEach(function(numerosDoJogo, indice) {
    var numerosAcertados = numerosDoJogo.filter(numero => resultado.includes(numero));
    var acertos = numerosAcertados.length;
    var dezenas = numerosDoJogo.length;
    var tr = tabelaJogos.insertRow();
    tr.insertCell().textContent = 'Jogo ' + (indice + 1);
    tr.insertCell().textContent = acertos + ' acertos';
    tr.insertCell().textContent = dezenas + ' dezenas';
    tr.insertCell().textContent = numerosAcertados.join(', '); // Use a variável correta aqui

            // Incrementa a contagem de premiação com base no número de acertos
            if (acertos.length >= 11 && acertos.length <= 15) {
                premiacao[acertos.length]++;
            }

         calcularPremiacaoEspecifica(dezenas, acertos, premiacao);

        });

        // Adiciona a tabela de jogos atualizada ao container
        resultadoContainer.appendChild(tabelaJogos);

            resultadoContainer.appendChild(togglePremiacaoBtn);


        // Cria e adiciona a tabela de premiação atualizada
        var tabelaPremiacao = document.createElement('table');
        tabelaPremiacao.innerHTML = '<tr><th>Acertos</th><th>Quantidade de Prêmios</th></tr>';

        Object.keys(premiacao).sort((a, b) => a - b).forEach(function(acertos) {
            if (!exibirTodosAcertos && acertos < 11) {
                return; // Não exibe acertos de 0 a 10 se exibirTodosAcertos for falso
            }
            var tr = tabelaPremiacao.insertRow();
            tr.insertCell().textContent = acertos + ' acerto(s)';
            tr.insertCell().textContent = premiacao[acertos] + ' prêmio(s)';
        });

        resultadoContainer.appendChild(tabelaPremiacao);
    }
});


function calcularPremiacaoEspecifica(dezenas, acertos, premiacao) {
    const regrasDePremiacao = {
        '16': {
            '15': [1, 15],
            '14': [2, 14],
            '13': [3, 13],
            '12': [4, 12],
            '11': [5]
        },
        '17': {
            '15': [1, 30, 105],
            '14': [3, 42, 91],
            '13': [6, 52, 78],
            '12': [10, 60],
            '11': [15]
        },
         '18': {
            '15': [1, 45, 315, 455],
            '14': [4, 84, 364, 364],
            '13': [10, 130, 390],
            '12': [20, 180],
            '11': [35]
        },
         '19': {
            '15': [1, 60, 630, 1820, 1365],
            '14': [5, 140, 910, 1820],
            '13': [15, 260, 1170],
            '12': [35, 420],
            '11': [70]
        },
         '20': {
            '15': [1, 75, 1050, 4550, 6825],
            '14': [6, 210, 1820, 5460],
            '13': [21, 455, 2730],
            '12': [56, 840],
            '11': [126]
        }

        
    };

    // Adiciona uma verificação para garantir que só modifique a premiação se os acertos estiverem entre 11 e 15
    
        if (regrasDePremiacao.hasOwnProperty(dezenas.toString())) {
            const premios = regrasDePremiacao[dezenas.toString()];
            if (premios.hasOwnProperty(acertos.toString())) {
                premios[acertos.toString()].forEach((valor, index) => {
                    premiacao[acertos - index] += valor;
                });
            }
        } else {
            // Se não existem regras específicas para essa quantidade de dezenas
            premiacao[acertos]++;
        }
    }


