/*
 * Este arquivo coordena a execução do programa de busca por endereços Bitcoin.
 * Ele distribui a carga de trabalho entre várias threads de trabalhadores e controla
 * o fluxo de execução. Quando um endereço Bitcoin é encontrado, ele imprime o resultado
 * no console e o armazena em um arquivo de texto.
 */

const { Worker, isMainThread } = require('worker_threads');
const fs = require('fs');
const { min, max } = require('./config');

// Funções para colorir o output do console
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const blue = (text) => `\x1b[34m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;

// Função para escrever o resultado em um arquivo
function writeResultToFile(result) {
    fs.appendFileSync('result.txt', result + '\n', { encoding: 'utf-8' }); // Append result to file
}

const numThreads = Math.ceil(require('os').cpus().length / 2); // Usa metade dos núcleos da CPU
const startTime = Date.now();

// Função para criar threads de trabalhadores
async function createWorker(start, end) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', {
            workerData: { start, end }
        });

        worker.on('message', (message) => {
            if (message.startsWith('Found matching address')) {
                console.log(green(message));
                writeResultToFile(message); // Salva o resultado no arquivo
                resolve(message);
            } else if (message.startsWith('Worker')) {
                console.log(blue(message));
            } else {
                console.log(yellow(message));
            }
        });

        worker.on('error', reject);

        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            } else {
                resolve();
            }
        });
    });
}

// Função principal para distribuir o intervalo entre os trabalhadores
async function main() {
    const range = Math.floor((max - min) / numThreads);
    const promises = [];
    for (let i = 0; i < numThreads; i++) {
        const start = min + i * range;
        const end = (i === numThreads - 1) ? max : start + range - 1;
        promises.push(createWorker(start, end));
    }

    try {
        await Promise.all(promises);
        const elapsedTime = (Date.now() - startTime) / 1000;
        console.log(green('All workers completed successfully'));
        console.log(green(`Tempo: ${elapsedTime} seconds\n`));
    } catch (error) {
        console.error(red(error));
    }
}

if (isMainThread) {
    main();
}
