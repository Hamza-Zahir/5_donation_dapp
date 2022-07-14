const HDWalletProvider = require('@truffle/hdwallet-provider');

const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    // bsc: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org/`),
    //   network_id: 56,       // Ropsten's id
    //   // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    //   // confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
    //   // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    bscTestnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,       // Ropsten's id
      // gas: 5500000,        // Ropsten has a lower block limit than mainnet
      // confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
      // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },

  },

  compilers: {
    solc: {
      version: "0.8.15",
    }
  },
//  0x2Dc28C932d45A44E3A6aEa32C8c470774591AbfF
};
