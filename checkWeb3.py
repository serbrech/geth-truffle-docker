#!/usr/bin/python3 -u
# -*- encoding: utf-8 -*-
# please install: apt-get install -y python3-pip && pip3 install web3
# sudo chmod +x checkWeb3.py
# to use: python3 checkWeb3.py
from web3 import Web3, RPCProvider, IPCProvider
import json


### Parameters ##################
web3            = Web3(RPCProvider(host='127.0.0.1', port='8540')) # Paritytest:8545, (gethtest:8543)
remote         	= '0xf734e65a97c7e5ca5e5255d91f236751a6649d0b'  # our gethtest node: 0xf734e65a97c7e5ca5e5255d91f236751a6649d0b
local           = web3.eth.accounts[0]   # use web3.eth.accounts[0] or one local addr: '0x...'
amountInEther   = 0.000111111
gas             = 21000
gasPrice        = 20000000000
value           = web3.toWei(amountInEther,'ether')
#################################

if web3.version.network == 1: network = 'LIVE(Homestead)'
elif web3.version.network == 2: network = 'TESNET(morden)'
elif web3.version.network == 3: network = 'TESTNET(ropsten)'
elif web3.version.network == 2017042099: network = 'DEVCHAIN(Geneva)'
else: network = 'UNKNOWN'

print ('\n#######  Node info ##############')
print ('Network		: '+ str(web3.version.network) +' --> '+network)
print ('NodeVersion	: '+ str(web3.version.node))
print ('Block		: '+ str(web3.eth.blockNumber))
print ('Syncing? 	: '+ str(web3.eth.syncing))
print ('Peers		: '+ str(web3.net.peerCount))
print ('All my accounts	: '+ str(web3.eth.accounts))
print ('LocalAddr  = '+local+'     balance = '+ str(web3.eth.getBalance(local)) +'    --> '+str(web3.fromWei(web3.eth.getBalance(local),'ether'))+' Ether')
print ('RemoteAddr = '+remote+'     balance = '+ str(web3.eth.getBalance(remote)) +'    --> '+str(web3.fromWei(web3.eth.getBalance(remote),'ether'))+' Ether\n')

exit()

# LIST OF MY PENDING TX
pblock = web3.eth.getBlock('pending', 'true')
#print(json.dumps(pblock, sort_keys=True, indent=4))
for ptx in pblock['transactions']:
  #print(json.dumps(ptx, sort_keys=True, indent=4))  # <-- List all pending tx full
  #print(json.dumps('from:' + ptx['from'] +' tx:' + ptx['hash'])) # <-- List all pending tx formated
  # List pending tx from my local address 0
  if ptx['from'] == local:
    print('--> PENDING TX FROM MY ADDRESS:'+ptx['from'])
    print(json.dumps(ptx, sort_keys=True, indent=4))

# SEND ETHER
q= input ('\n--> Send tx of '+str(amountInEther)+' Ether from localAddr0:'+str(local)+' to remoteAddr:'+str(remote)+' on network '+network+' ? [y/N]')
if q == 'Y' or q=='y':
  tx = web3.eth.sendTransaction({'from':local, 'to':remote, 'value':hex(value), 'gas':hex(gas), 'gasPrice':hex(gasPrice)}) # <-- if need to resend a blocked tx (with more gaz) use: ",'nonce':hex(1048609)" <-- nonce number of the problematic tx
  print(tx+'\n')
  print(web3.eth.getTransaction(tx))
