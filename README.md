# Ethereum environment with docker-compose + smart contract with truffle #

![devchain-infra.png](https://github.com/gregbkr/geth-truffle-docker/raw/master/media/devchain-infra.png)

## Description

This compose will give you in one command line:
- **ethereum go-client** (geth) running on port 8544 with
  - A default account, already unlocked
  - Connected to Geneva devchain (network ID=2017042099)
  - Mining the blocks
  - Data are saved out of the container on your host in `/root/.ethereum`, so no problem if you delete the container
- **Testrpc** eth-node running a test network on port 8545
- **Truffle**: where you can test and deploy smart contracts
- **Netstatsapi**: which will collect and send your node perf to our devchain dashboard on http://factory.shinit.net:15000
- **Netstatsfront**: dashboard to display eth stats (not used by default, please uncomment in `docker-compose.yml` if needed and browse http://localhost:3000 )


## 0. Prerequisit
- A linux host, preferable ubuntu 14.x or 16.x. If you are on windows or MAC, please use [Vagrant](#vagrant) --> see in annexes
- [Docker](#docker) v17 and [docker-compose](#docker-compose) v1.15 
- This code: `git clone https://github.com/gregbkr/geth-truffle-docker.git devchain && cd devchain`
- Create an environment var to declare your geth node name: `echo "export GETH_NODE=<YOUR_NODE_NAME>" >> ~/.profile && source ~/.profile`
- Check your node name: `echo $GETH_NODE`

## 1. Run containers

- Run the stack: `docker-compose up -d`
- Check geth is up and answering locally: `curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' localhost:8544`
- Check testrpc node is running: `curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' localhost:8545`
- Other rpc commands [here](https://github.com/ethereum/wiki/wiki/JSON-RPC#json-rpc-methods)

## 2. Geth
- Check container logs: `docker logs -f geth`
- Start shell in the geth container: `sudo docker exec -it geth sh` 
- Interact with geth:
  - List account: `geth --datadir=/root/.ethereum/devchain account list` (other commands [here](https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options))
  - To see your keys: `cat /root/.ethereum/devchain/keystore/*`
  - Backup the account somewhere safe. For example, I saved this block for my wallet (carefull, you can steal my coins with these infos):
```
{"address":"6e068b2fcf3ed73d5166d0b322fa10e784b7b4fe","crypto":{"cipher":"aes-128-ctr","ciphertext":"0d392da6deb66b13c95d1b723ea51a53ab58e1f7555c3a1263a5b203885b9e51","cipherparams":{"iv":"7a919e171cda132f375afd5f9e7c2ba1"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"1f3f814262b9a4ce3c2f3e1cabb5788f0520101f00598aa0b84bbda08ceaaf31"},"mac":"8e8393e86fe2278666ec26e9956b49adc25bc2e7492d5a25ee30e8118dd17441"},"id":"71aa2bfd-ee91-4206-ab5e-82c38ccd071f","version":3}/
```
  - The account is on your host too, exit docker `exit` then type `sudo ls /var/lib/docker/volumes/devchain_geth/_data/devchain`. From this location you can save or import another account (just copy/paste your key file)

- If needed, (within the geth container) create new account with:
  - Create password: `echo "Geneva2017" > /root/.ethereum/devchain/pw2`
  - create account: `geth --datadir=/root/.ethereum/devchain account new --password /root/.ethereum/devchain/pw2`

- Mining (y/n)? In `docker-compose.yml` section `geth/command` add/remove `--fast --mine` and run again `docker-compose up -d`

- Check that you can see your node name on our netstat dashboard: http://factory.shinit.net:15000

- Use python to check your node, and later send ether: 
  - Install tools: `sudo apt-get install -y python3 python3-pip && pip3 install web3`
  - Check your node: `python3 scripts/checkWeb3.py`
  - Want to send ether? Edit `remote`, `amountInEther` and comment `exit()`, and run the same script

## 3. Truffle

#### 3.1 Description

Truffle will compile, test, deploy your smart contract.
In `/dapp` folder, there are few exemples of easy smart contracts:

- **HelloWorld**: display a single message
  - Contract addr: `0xbbe920b156febdb475d5139c8d86201b5a84b2fd`
  - Contract name: `Greeter`
  - Function: `greeter()`: display the recorded message
  - Ex: `Greeter.at('0xbbe920b156febdb475d5139c8d86201b5a84b2fd').greeter()`
  - Abi: 
```
[{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"payable":false,"type":"constructor"}]
```

- **MetaCoin**: basic coin contract (default truffle contract you get when typing `truffle init`). Deployer's address gets 1000 coins
  - Contract addr: `0x718c8c6348b268d62c617cbd175703bd10b4f8fa`
  - Contract name: `MetaCoin`
  - Functions: 
    - `getBalance(addr)`: display balance in gwei
    - `getBalanceInEth(addr)`: display balance in ether
    - `sendCoin(addr, amount)`: sent coin to address
  - Ex: `MetaCoin.at('0xbbe920b156febdb475d5139c8d86201b5a84b2fd').getBalance('0x99b77b612d43ba830d9db1eda0d0d23600db6874')`
  - Abi: 
 ```
 [{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getBalanceInEth","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"sendCoin","outputs":[{"name":"sufficient","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"}]
 ```

- **Counter**: from 0, increment a simple counter, and see the result 
  - Contract addr: `0x44cd1f1fca0243f06f81238d039847855f3cf902`
  - Contract name: `Counter`
  - Functions: 
    - `increment()`: increment the counter each time you run
    - `getCount()`: see the result
  - Ex: `Counter.at('0x44cd1f1fca0243f06f81238d039847855f3cf902').getCount()`
  - Abi: 
```
[{"constant":true,"inputs":[],"name":"getCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"increment","outputs":[],"payable":false,"type":"function"}]
```
  
Each project has test functions in solidity `./test/*.sol` or in javascript `./test/*.js` (doing the same tests)

#### 3.2 Test our HelloWorld dapp in truffle
- Go in truffle container:  `docker exec -it truffle sh`
- Go to HelloWorld project: `cd /dapps/HelloWorld`
- Check configuration: `cat truffle.js` <-- it should map with `geth:8544` and `testrpc:8545`
- Customize the output of the HelloWorld: `vi migrations/2_deploy_contracts.js`, edit: `I am Groot!`
- Test the contract against testrpc node: `truffle test --network testrpc`
- Test against our devchain network: `truffle test --network devchain`
- If warning message: `authentication needed: password or unlock` --> you need to unlock your wallet!

#### 3.3 Send your helloWorld contract to devchain
- Send/migrate contract to devchain: `truffle migrate --network devchain` <-- you should get the contract number: `Greeter: 0xbbe920b156febdb475d5139c8d86201b5a84b2fd`
- Check your last deployment: `truffle network`

#### 3.4 Interact with the contract from the truffle console:
- Access the console: `truffle console --network devchain` <-- Need to be in the right dapp folder to interact with contract
- See last Greeter contract deployed: `Greeter.deployed()` <-- Greeter is the declared name of the contract
- Greeter address: `Greeter.address`
- Run the `greet()` function (the main one) of our contract: `Greeter.at('0xbbe920b156febdb475d5139c8d86201b5a84b2fd').greet()`
- We can map our contract to an object: `var contract = Greeter.at('0xbbe920b156febdb475d5139c8d86201b5a84b2fd')`
- And simply call functions of this object: `contract.greet()`

#### 3.5 Share your contract with others
For that you will need:
- The **contract address**: `0xbbe920b156febdb475d5139c8d86201b5a84b2fd`
- The **abi**: a description of the functions of our contract 
  - From our host: install jq: `sudo apt-get install jq`
  - And display the abi: `cat dapp/HelloWorld/build/contracts/Greeter.json | jq -c '.abi'`
  - Result: 
```
[{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"payable":false,"type":"constructor"}]
```
  - Go to a truffle's friend pc (or delete truffle container on your host `docker stop truffle; docker rm truffle` and start a new one `docker-compose up -d`), and interact with your contract:
  - Create the abi: 
```
abi=[{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"payable":false,"type":"constructor"}]
```
  - You can now run your contract function to see your custom message: `web3.eth.contract(abi).at('0xbbe920b156febdb475d5139c8d86201b5a84b2fd').greet()`

#### 3.6 New contract from template:
- Launch a new contract (a clone) from the template Greeter known locally by truffle: `var greeter2 = Greeter.new("Hello gva")`
- Get the address: `greeter2`
- Check the output: `Greeter.at('0x0a4c092ed54bcec766b4da5f641d396494a26638').greet()`

#### 3.7 Within truffle, you can interact with your geth wallet:
- See account0 balance: `web3.fromWei(web3.eth.getBalance(web3.personal.listAccounts[0]))`
- Unlock your account: `web3.personal.unlockAccount(web3.personal.listAccounts[0], "17Fusion", 150000);`
- Send some ether: `web3.eth.sendTransaction({from:web3.personal.listAccounts[0], to:'0x41df2990b4efd225f2bc12dd8b6455bf1c07ff6d', value: web3.toWei(10, "ether")})`


## Annexes

### Vagrant
- Install Git for windows or similar command line that you can git. 
- Install the latest version of [vagrant](https://www.vagrantup.com/downloads.html) and [virtualbox](https://www.virtualbox.org/wiki/Downloads)
- Clone our repo and go at the root
- Create vagrant vm: `vagrant up`, and wait the vm to build
- Access the vm: `vagrant ssh`
- Access the files: `cd /vagrant/`
--> You are now in an ubuntu host, you can continue the tuto!

### Docker
Install docker:
```
wget https://get.docker.com/ -O script.sh
chmod +x script.sh
sudo ./script.sh
sudo usermod -aG docker ${USER}
```
check docker version: `docker version`

Docker commands:
- List docker image: `docker image list`
- List docker container: `docker container list`

### Docker-compose
Replace 1.15.0 with latest version available on https://github.com/docker/compose/releases 
```
sudo -i
curl -L https://github.com/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
exit
```
check docker-compose version `docker-compose version`

