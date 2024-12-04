//calculadora
function calcularConsumo(event) {
    event.preventDefault(); 
    const consumoMensual = parseFloat(document.getElementById("consumoM").value);
    
    if (isNaN(consumoMensual) || consumoMensual <= 0) {
        document.getElementById("resultado").innerHTML = "Por favor, ingrese un valor válido.";
        return;
    }

    const consumoAnualU = (consumoMensual * 12) / 1000; 
    const porcentajeConsumoTo = (consumoAnualU * 100) / 616;

    document.getElementById("resultado").innerHTML = `
        <p>Consumo anual en TWh: <strong>${consumoAnualU.toFixed(2)}</strong></p>
        <p>Porcentaje del consumo solar total: <strong>${porcentajeConsumoTo.toFixed(2)}%</strong></p>
    `;
}
const csvFilePath = './energy_production_1965_2022.csv'; 

// para cargar el csv
async function loadCSV(filePath) {
    const response = await fetch(filePath);
    const csvText = await response.text();
    const rows = csvText.split('\n').slice(1);
    return rows.map(row => {
        const cols = row.split(',');
        return {
            year: cols[0],
            country: cols[1],
            solar: parseFloat(cols[2]),
            hydro: parseFloat(cols[3]),
            wind: parseFloat(cols[4]),
            biofuel: parseFloat(cols[5]),
            geothermal: parseFloat(cols[6]),
            conventional: parseFloat(cols[7])
        };
    });
}

// mostrar datos
async function displayData(filterCountry = 'all') {
    const data = await loadCSV(csvFilePath);
    const tbody = document.querySelector('#energyTable tbody');
    tbody.innerHTML = ''; // Limpiar la tabla
    data.forEach(row => {
        if (filterCountry === 'all' || row.country === filterCountry) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.year}</td>
                <td>${row.country}</td>
                <td>${row.solar.toFixed(2)}</td>
                <td>${row.hydro.toFixed(2)}</td>
                <td>${row.wind.toFixed(2)}</td>
                <td>${row.biofuel.toFixed(2)}</td>
                <td>${row.geothermal.toFixed(2)}</td>
                <td>${row.conventional.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        }
    });
}

// filtro de pais
document.getElementById('countryFilter').addEventListener('change', event => {
    const country = event.target.value;
    displayData(country);
});

// Mostrar/ocultar la tabla
document.getElementById('toggleTable').addEventListener('click', () => {
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer.style.display === 'none') {
        tableContainer.style.display = 'block';
        document.getElementById('toggleTable').textContent = 'Ocultar tabla';
    } else {
        tableContainer.style.display = 'none';
        document.getElementById('toggleTable').textContent = 'Mostrar tabla';
    }
});

// Cargar los datos iniciales
displayData();


// Datos de energías renovables de Colombia en 2022
const colombiaData2022 = {
    solar: 616.3903730425842,        
    hydro:4263.7108401630685,        
    wind:1058.5916083834761,         
    biofuel:648.7060658622842,       
    geothermal:419.6332205003383     
};

// Datos para las gráficas
const labels = ['Solar', 'Hidroeléctrica', 'Eólica', 'Biocombustibles', 'Geotérmica'];
const renewableData = [
    colombiaData2022.solar,
    colombiaData2022.hydro,
    colombiaData2022.wind,
    colombiaData2022.biofuel,
    colombiaData2022.geothermal
];

// Gráfico de Torta
const pieCtx = document.getElementById('pieChart').getContext('2d');
new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels,
        datasets: [{
            data: renewableData,
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
        }]
    },
    options: {
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Participación de Energías Renovables en Colombia (2022)'
            }
        }
    }
});

// Gráfico de Barras
const barCtx = document.getElementById('barChart').getContext('2d');
new Chart(barCtx, {
    type: 'bar',
    data: {
        labels,
        datasets: [{
            label: 'Producción (TWh)',
            data: renewableData,
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Producción de Energías Renovables por Fuente en Colombia (2022)'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Producción (TWh)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Tipos de Energía'
                }
            }
        }
    }
});

// Gráfico de Área
const areaCtx = document.getElementById('areaChart').getContext('2d');
new Chart(areaCtx, {
    type: 'line',
    data: {
        labels, 
        datasets: [{
            label: 'Producción de Energía (TWh)',
            data: renewableData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)', 
            borderColor: 'rgba(54, 162, 235, 1)',       
            fill: true,
            tension: 0.4 
        }]
    },
    options: {
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Producción de Energías Renovables en Colombia (2022)'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Producción (TWh)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Tipos de Energía'
                }
            }
        }
    }
});
// Función para obtener los datos
async function getSolarConsumptionData(filePath) {
    const data = await loadCSV(filePath);
    const filteredData = data.filter(row => row.country === 'Colombia' && row.year >= 2000 && row.year <= 2022);
    return filteredData.map(row => ({
        year: row.year,
        solar: row.solar
    }));
}

// gráfico de líneas
async function createSolarConsumptionLineChart() {
    const filePath = './energy_production_1965_2022.csv'; 
    const solarData = await getSolarConsumptionData(filePath);

    const years = solarData.map(item => item.year);
    const solarConsumption = solarData.map(item => item.solar);

    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Consumo de Energía Solar (TWh)',
                data: solarConsumption,
                borderColor: '#ff6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Tendencia del Consumo de Energía Solar en Colombia (2000-2022)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Consumo (TWh)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Año'
                    }
                }
            }
        }
    });
}


createSolarConsumptionLineChart();

const formComentarios = document.getElementById('formComentarios');
const comentarioInput = document.getElementById('comentarioInput');
const listaComentarios = document.querySelector('#listaComentarios ul');

formComentarios.addEventListener('submit', function (e) {
    e.preventDefault(); 
    const comentario = comentarioInput.value.trim(); 

    if (comentario) {
    
        const nuevoComentario = document.createElement('li');
        nuevoComentario.textContent = comentario;

        
        listaComentarios.appendChild(nuevoComentario);

        // Limpiar el textarea
        comentarioInput.value = '';
    } else {
        alert('Por favor, escribe un comentario antes de enviar.');
    }
});


