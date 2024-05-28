/*
 * Este arquivo contém a lógica de processamento para cada thread de trabalhador.
 * Cada thread gera chaves privadas, calcula os endereços Bitcoin correspondentes
 * e verifica se eles correspondem ao endereço-alvo. Quando um endereço é encontrado,
 * ele envia uma mensagem para o thread principal, indicando o sucesso da busca.
 */


const CoinKey = require('coinkey');
const { parentPort, workerData } = require('worker_threads');
const { min, max, wallet } = require('./config');

const { start, end } = workerData;

// Função para gerar o endereço público a partir da chave privada
function generatePublic(privateKey) {
    const key = new CoinKey(Buffer.from(privateKey, 'hex'));
    key.compressed = true;
    return key.publicAddress;
}

// Loop para verificar chaves privadas no intervalo fornecido
let key = BigInt(start);
while (key <= BigInt(end)) {
    const privateKey = key.toString(16).padStart(64, '0');
    const publicAddress = generatePublic(privateKey);
    if (publicAddress === wallet) {
        parentPort.postMessage(`Found matching address: \n\n${publicAddress} \n\nwith private key: \n${privateKey}\n`);
        process.exit(0); // Encerra o processo com sucesso
    }
    key += BigInt(1);
}
