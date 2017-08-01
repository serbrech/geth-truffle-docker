module.exports = {
  networks: {
    testrpc: {
      host: "testrpc",
      port: 8545,
      network_id: "*" // Match any network id
    },
    devchain: {
      host: "geth",
      port: 8544,
      network_id: "2017042099"
    }
  }
};
