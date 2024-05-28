/*
 * Este arquivo contém as configurações do programa, incluindo os valores mínimo e máximo
 * para as chaves privadas a serem geradas, bem como o endereço Bitcoin alvo a ser encontrado.
 * Separar esses valores em um arquivo de configuração facilita a alteração e o teste de diferentes
 * conjuntos de dados sem a necessidade de modificar o código principal.
 */


module.exports = {
    min: 0x1000000,
    max: 0x1ffffff,
    wallet: '15JhYXn6Mx3oF4Y7PcTAv2wVVAuCFFQNiP' // Endereço Bitcoin a ser encontrado
};
