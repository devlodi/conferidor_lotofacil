document.addEventListener("DOMContentLoaded", function() {
    var fileInput = document.getElementById('file-input');
    var jogosTextarea = document.getElementById('jogos-textarea');
    var resultadoInput = document.getElementById('resultado');
    var resultadoContainer = document.getElementById('resultado-conferencia');

 fileInput.addEventListener('change', function() {
    var file = fileInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            jogosTextarea.value = e.target.result;
            conferirJogos();
        };
        reader.readAsText(file);
        // Limpa o valor do input após a leitura para garantir que o evento 'change' seja disparado novamente
        fileInput.value = '';
    }
});


    resultadoInput.addEventListener('input', conferirJogos); // Conferir jogos quando o resultado muda
    jogosTextarea.addEventListener('input', conferirJogos); // Conferir jogos quando o texto dos jogos muda

    function conferirJogos() {
        // Primeiro limpa o conteúdo anterior
        resultadoContainer.innerHTML = '';

        var jogos = jogosTextarea.value.trim().split('\n').map(function(jogo) {
            return jogo.trim().split(/\s+/).map(Number);
        });
        var resultado = resultadoInput.value.trim().split(/\s+/).map(Number);

        // Inicializa a contagem de premiação
        var premiacao = {
            11: 0, 12: 0, 13: 0, 14: 0, 15: 0
        };

        // Cria a tabela de resultados dos jogos
        var tabelaJogos = document.createElement('table');
        tabelaJogos.innerHTML = '<tr><th>Jogo</th><th>Acertos</th><th>DZ/Por jogos</th><th>Números Acertados</th></tr>';

        jogos.forEach(function(numerosDoJogo, indice) {
            var acertos = numerosDoJogo.filter(numero => resultado.includes(numero));
            var tr = tabelaJogos.insertRow();
            tr.insertCell().textContent = 'Jogo ' + (indice + 1);
            tr.insertCell().textContent = acertos.length + ' acertos';
            tr.insertCell().textContent = numerosDoJogo.length + ' dezenas';
            tr.insertCell().textContent = acertos.join(', ');

            // Incrementa a contagem de premiação com base no número de acertos
            if (acertos.length >= 11 && acertos.length <= 15) {
                premiacao[acertos.length]++;
            }
        });

        // Adiciona a tabela de jogos atualizada ao container
        resultadoContainer.appendChild(tabelaJogos);

        // Cria e adiciona a tabela de premiação atualizada
        var tabelaPremiacao = document.createElement('table');
        tabelaPremiacao.innerHTML = '<tr><th>Acertos</th><th>Quantidade de Prêmios</th></tr>';

        Object.keys(premiacao).sort((a, b) => a - b).forEach(function(acertos) {
            var tr = tabelaPremiacao.insertRow();
            tr.insertCell().textContent = acertos + ' acerto(s)';
            tr.insertCell().textContent = premiacao[acertos] + ' prêmio(s)';
        });

        resultadoContainer.appendChild(tabelaPremiacao);
    }
});
