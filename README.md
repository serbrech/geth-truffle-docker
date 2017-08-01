## Description
This compose will give you in on command line:
- **ethereum go-client** (geth) running on port 8544 with
  - A default account, already unlocked
  - Connected to devchain (network 2017042099)
  - Mining the blocks
  - Data are saved out of the container on your host in `/root/.ethereum`, so no problem if you delete the container
- **Testrpc** eth-node running a test network on port 8545
- **Truffle**: where you can test and deploy smart contracts
- **Netstats**: which will collect and send your node perf to our devchain dashboard on http://factory.shinit.net:15000

## Prerequisit
- A linux VM, preferable ubuntu 14.x or 16.x. If you are on windows or MAC, please use [Vagrant](#vagrant) --> see in annexes 
- [Docker](#docker) v17 and [docker-compose](#docker-compose) v1.15 
- This code: `git clone https://github.com/gregbkr/geth-truffle-docker.git devchain && cd devchain`

## Run containers

- Check your username: `echo $USER` <-- we will use this variable to name your geth node (if you don't have it, create it as persistent)
- Run the stack: `sudo docker-compose up -d`
- Check geth is up and answering locally: `curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' localhost:8544`
- Check testrpc node is running: `curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' localhost:8545`

## Geth
- Check container logs: `sudo docker logs -f geth`
- Start shell in the geth container: `sudo docker exec -it geth sh` 
- Interact with geth:
  - List account: `geth --datadir=/root/.ethereum/devchain account list`
  - To see your keys: `cat /root/.ethereum/devchain/keystore/*`
  - Backup the account somewhere safe. For example, I saved this block for my wallet (carefull, you can steal my coins with these info):
`{"address":"6e068b2fcf3ed73d5166d0b322fa10e784b7b4fe","crypto":{"cipher":"aes-128-ctr","ciphertext":"0d392da6deb66b13c95d1b723ea51a53ab58e1f7555c3a1263a5b203885b9e51","cipherparams":{"iv":"7a919e171cda132f375afd5f9e7c2ba1"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"1f3f814262b9a4ce3c2f3e1cabb5788f0520101f00598aa0b84bbda08ceaaf31"},"mac":"8e8393e86fe2278666ec26e9956b49adc25bc2e7492d5a25ee30e8118dd17441"},"id":"71aa2bfd-ee91-4206-ab5e-82c38ccd071f","version":3}/`
  - The account is on your vm too, exit docker `exit` then type `sudo ls /var/lib/docker/volumes/devchain_geth/_data/devchain`. From this location you can save or import another account (just copy/paste your key file)

- If needed, create new account with:
  - Create password: `echo "Geneva2017" > /root/.ethereum/devchain/pw2`
  - create account: `geth --datadir=/root/.ethereum/devchain account new --password /root/.ethereum/devchain/pw2`

- Don't want to mine? In `docker-compose.yml` section `geth/command` remove `--fast --mine` and run again `docker-compose up -d`

- Check that you can see your node name on our netstat dashboard: http://factory.shinit.net:15000

- Use python to check your node, and later send ether: 
  - Install tools: `sudo apt-get install -y python3 python3-pip && pip3 install web3`
  - Check your node: `python3 checkWeb3.py`
  - Want to send ether? Edit `remote`, `amountInEther` and comment `exit()`, and run the same script

## Truffle
Go in truffle container:  `sudo docker exec -it truffle sh`
Try truffle:
- Go to metaCoin project: `cd /dapps/metaCoin`
- Check configuration: `cat truffle.js` <-- it should map with `geth:8544` and `testrpc:8545`
- Test the contract against testrpc node: `truffle test --network testrpc`
- Test against our devchain network: `truffle test --network devchain`
- --> if warning message: `authentication needed: password or unlock` --> you need to unlock your wallet!

Now test our helloWord dapp
- Navigate to the folder: `cd /dapp/helloWorld`
- Test against testrpc: `truffle test --network testrpc`
- Test against devchain: `truffle test --network devchain`

## Annexes

### Vagrant
- Install the latest version of [vagrant](https://www.vagrantup.com/downloads.html) and [virtualbox](https://www.virtualbox.org/wiki/Downloads)
- Clone our repo and go at the root
- Create vagrant vm: `vagrant up`, and wait the vm to build
- Access the vm: `vagrant ssh`
--> You are now in an ubuntu vm, you can continue the tuto!


### Docker

Install docker:
```
wget https://get.docker.com/ -O script.sh
chmod +x script.sh
sudo ./script.sh
```
check docker version: `sudo docker version`

Docker commands:
- List docker image: `sudo docker image list`
- List docker container: `sudo docker container list`
[Back to Prerequisit](#prerequisit)

### docker-compose
Replace 1.15.0 with latest version available on https://github.com/docker/compose/releases 
```
sudo -i
curl -L https://github.com/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
exit
```
check docker-compose version `docker-compose version`
[Back to Prerequisit](#prerequisit)
