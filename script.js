document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('drop_zone').addEventListener('drop', handleFileSelect, false);

function handleFileSelect(event) {
    event.preventDefault();
    const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const csv = event.target.result;
            Papa.parse(csv, {
                header: true,
                complete: function(results) {
                    const jsonData = results.data;
                    console.log(jsonData); // Exibe os dados do CSV no console para verificação
                    exibirDados(jsonData); // Insira aqui o código para inserir os dados nas divs corretas
                    esconderDropZone(); // Esconde a drop_zone após adicionar o arquivo
                }
            });
        };
        reader.readAsText(file);
    }
}

function esconderDropZone() {
    const dropZone = document.getElementById('drop_zone');
    dropZone.style.display = 'none'; // Esconde a drop_zone
}

function exibirDados(jsonData) {
    const container = document.getElementById('dataDisplay');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (Object.values(row).some(value => value.trim() !== '')) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');

            Object.keys(row).forEach(key => {
                if (key !== 'Executante') { // Não mostra a coluna Executante
                    const cellDiv = document.createElement('div');
                    cellDiv.classList.add('cell');
                    if (key === 'Local') {
                        cellDiv.textContent = row[key].trim() === '' ? 'Presencial' : 'Online';
                    } else {
                        cellDiv.textContent = row[key];
                    }
                    rowDiv.appendChild(cellDiv);
                }
            });

            container.appendChild(rowDiv);
        }
    }
}

document.getElementById('drop_zone').addEventListener('dragover', function(event) {
    event.preventDefault();
});

function atualizarRelogio() {
    const agora = new Date();
    const horas = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    const segundos = agora.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${horas}:${minutos}:${segundos}`;
}

setInterval(atualizarRelogio, 1000);

let scrollDirection = 1;
let scrollSpeed = 1;
let scrollInterval;
let isWaiting = false;

function startScroll() {
    if (!scrollInterval) {
        scrollInterval = setInterval(function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.scrollHeight;
            const currentScroll = window.pageYOffset;
            const targetScroll = currentScroll + scrollDirection * scrollSpeed;

            if (targetScroll >= documentHeight - windowHeight) {
                if (!isWaiting) {
                    isWaiting = true;
                    setTimeout(function() {
                        scrollDirection = -1;
                        window.scrollTo(0, 0);
                        setTimeout(function() {
                            isWaiting = false;
                        }, 5000);
                    }, 5000);
                }
            } else if (targetScroll <= 0) {
                if (!isWaiting) {
                    isWaiting = true;
                    setTimeout(function() {
                        scrollDirection = 1;
                        isWaiting = false;
                    }, 5000);
                }
            }

            window.scrollTo(0, targetScroll);
        }, 10);
    }
}

function stopScroll() {
    clearInterval(scrollInterval);
    scrollInterval = null;
}

startScroll();

document.getElementById('scrollToggleButton').addEventListener('click', function() {
    if (scrollInterval) {
        stopScroll();
    } else {
        startScroll();
    }
});

window.addEventListener('resize', function() {
    stopScroll();
    startScroll();
});
