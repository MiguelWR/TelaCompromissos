document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const csv = event.target.result;
            Papa.parse(csv, {
                header: true,
                complete: function(results) {
                    const jsonData = results.data;
                    console.log(jsonData);
                    displayData(jsonData);
                    hideDropZone(); 
                }
            });
        };
        reader.readAsText(file);
    }
}

function hideDropZone() {
    const dropZone = document.getElementById('drop_zone');
    dropZone.style.display = 'none'; 
}

function displayData(jsonData) {
    const container = document.getElementById('dataDisplay');
    container.innerHTML = ''; 

    for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (Object.values(row).some(value => value.trim() !== '')) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');

            Object.keys(row).forEach(key => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                cellDiv.textContent = row[key];
                rowDiv.appendChild(cellDiv);
            });

            container.appendChild(rowDiv);
        }
    }
}


document.getElementById('drop_zone').addEventListener('dragover', function(event) {
    event.preventDefault();
});

function createDivs(jsonData) {
    const container = document.getElementById('topo');

    for (let i = 1; i < jsonData.length; i++) {
        const dados = jsonData[i];

    
        const div0Clone = document.getElementById('div0').cloneNode(true);
        div0Clone.style.display = 'flex';
        div0Clone.style.flexWrap = 'wrap';
        div0Clone.style.marginTop = '20px';

      
        const editaveisDiv0 = div0Clone.querySelectorAll('.editavel');
        editaveisDiv0.forEach((editavel, index) => {
            if (index === 0) {
               
                const span = document.createElement('span');
                span.textContent = dados[`div${index+1}`];
                span.className = 'data-horario'; 
                editavel.innerHTML = '';
                editavel.appendChild(span);
            } else {
                editavel.textContent = dados[`div${index+1}`];
            }
        });

        container.appendChild(div0Clone);

        // Clonar div1
        const div1Clone = document.createElement('div');
        div1Clone.className = 'div1'; 
        div1Clone.style.display = 'flex'; 
        div1Clone.style.flexWrap = 'wrap'; 
        div1Clone.style.marginTop = '20px'; 

        // Clonar div2
        const div2Clone = document.createElement('div');
        div2Clone.className = 'div2'; 
        div2Clone.style.display = 'flex'; 
        div2Clone.style.flexWrap = 'wrap'; 
        div2Clone.style.marginTop = '20px'; 

        // Clonar div3
        const div3Clone = document.createElement('div');
        div3Clone.className = 'div3';
        div3Clone.style.display = 'flex'; 
        div3Clone.style.flexWrap = 'wrap'; 
        div3Clone.style.marginTop = '20px'; 

        // Clonar div4
        const div4Clone = document.createElement('div');
        div4Clone.className = 'div4'; 
        div4Clone.style.display = 'flex';
        div4Clone.style.flexWrap = 'wrap';
        div4Clone.style.marginTop = '20px'; 

        const editaveisDiv1 = div1Clone.querySelectorAll('.editavel');
        editaveisDiv1.forEach((editavel, index) => {
            editavel.textContent = dados[`div${index+6}`];
        });

        const editaveisDiv2 = div2Clone.querySelectorAll('.editavel');
        editaveisDiv2.forEach((editavel, index) => {
            editavel.textContent = dados[`div${index+11}`];
        });

        const editaveisDiv3 = div3Clone.querySelectorAll('.editavel');
        editaveisDiv3.forEach((editavel, index) => {
            editavel.textContent = dados[`div${index+16}`];
        });

        const editaveisDiv4 = div4Clone.querySelectorAll('.editavel');
        editaveisDiv4.forEach((editavel, index) => {
            editavel.textContent = dados[`div${index+21}`];
        });

        container.appendChild(div1Clone);
        container.appendChild(div2Clone);
        container.appendChild(div3Clone); 
        container.appendChild(div4Clone); 
    }
}

function normalize(input) {
    return input.normalize('NFC');
}

document.getElementById('drop_zone').addEventListener('drop', handleFileSelect, false);

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

function analisarPlanilha(jsonData) {
    const container = document.getElementById('dataDisplay');
    container.innerHTML = ''; 

    const columnNames = Object.keys(jsonData[0]); 

    const headerRow = document.createElement('div');
    headerRow.classList.add('row');
    columnNames.forEach(columnName => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell', 'header-cell');
        cellDiv.textContent = columnName;
        headerRow.appendChild(cellDiv);
    });
    container.appendChild(headerRow);

    jsonData.forEach(rowData => {

        const hasData = Object.values(rowData).some(value => value.trim() !== '');
        if (hasData) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');
            columnNames.forEach(columnName => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                cellDiv.innerHTML = `<span class="column-name">${columnName}:</span> ${rowData[columnName] || ''}`;
                rowDiv.appendChild(cellDiv);
            });
            container.appendChild(rowDiv);
        }
    });
}

analisarPlanilha(jsonData);

document.getElementById('drop_zone').addEventListener('drop', handleFileSelect, false);