var config_variable = {
    transak_api_key: 'ca55ce43-0421-4c7e-a89b-93ebda818cc8',
    etherscan_api_key: 'Y9EGXZ7UVGHSUS2N6FSNDCB6E5VCR7EUWD',
    etherscan_domain: 'https://kovan.etherscan.io',
    etherscan_api_domain: 'https://api-kovan.etherscan.io',
    optimism_etherscan_domain: 'https://kovan-optimistic.etherscan.io',
    optimism_etherscan_api_domain: 'https://api-kovan-optimistic.etherscan.io',
    block_number_of_dcn_creation: 3170000,
    L1blockOfL1L2Integration: 25700000,
    L2blockOfL1L2Integration: 35000,
    delay_for_L2_withdrawal_execution: 600,
    l1: {
        provider: 'https://kovan.infura.io/v3/c6ab28412b494716bc5315550c0d4071',
        chain_id: 42,
        addresses: {
            dcn_contract_address: '0x001dedC8c67EF6D1f4BB66FB28581d466650Cd76',
            dcn_to_l2_dcn_deposit_address: '0xa4D508dC72f5ce2B688d05ACFfe8E1AeF326831C',
            eth_to_l2_eth_deposit_address: '0x7cFF2b3b3702ED7deCc57fAa32940DCf855D2d29',
            ResolvedDelegateProxy: '0x4361d0f75a0186c05f971c566dc6bea5957483fd',
            L1CrossDomainMessenger: '0xaF91349fdf3B206E079A8FcaB7b8dFaFB96A654D'
        },
        abi_definitions: {
            dcn_contract_abi: [{"constant":true,"inputs":[],"name":"sellPriceEth","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"directTradeAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minBalanceForAccounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyPriceEth","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DentacoinAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DCNForGas","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gasForDCN","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gasReserve","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"constant":false,"inputs":[{"name":"newBuyPriceEth","type":"uint256"},{"name":"newSellPriceEth","type":"uint256"}],"name":"setEtherPrices","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newGasAmountInWei","type":"uint256"}],"name":"setGasForDCN","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newDCNAmount","type":"uint256"}],"name":"setDCNForGas","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newGasReserveInWei","type":"uint256"}],"name":"setGasReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"minimumBalanceInWei","type":"uint256"}],"name":"setMinBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"haltDirectTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unhaltDirectTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"buyDentacoinsAgainstEther","outputs":[{"name":"amount","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"sellDentacoinsAgainstEther","outputs":[{"name":"revenue","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amountOfEth","type":"uint256"},{"name":"dcn","type":"uint256"}],"name":"refundToOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
            L1CrossDomainMessenger_abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"FailedRelayedMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"_xDomainCalldataHash","type":"bytes32"}],"name":"MessageAllowed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"_xDomainCalldataHash","type":"bytes32"}],"name":"MessageBlocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"RelayedMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"bytes","name":"message","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"messageNonce","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"gasLimit","type":"uint256"}],"name":"SentMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_xDomainCalldataHash","type":"bytes32"}],"name":"allowMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_xDomainCalldataHash","type":"bytes32"}],"name":"blockMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"blockedMessages","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_libAddressManager","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"libAddressManager","outputs":[{"internalType":"contract Lib_AddressManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"address","name":"_sender","type":"address"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"uint256","name":"_messageNonce","type":"uint256"},{"components":[{"internalType":"bytes32","name":"stateRoot","type":"bytes32"},{"components":[{"internalType":"uint256","name":"batchIndex","type":"uint256"},{"internalType":"bytes32","name":"batchRoot","type":"bytes32"},{"internalType":"uint256","name":"batchSize","type":"uint256"},{"internalType":"uint256","name":"prevTotalElements","type":"uint256"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct Lib_OVMCodec.ChainBatchHeader","name":"stateRootBatchHeader","type":"tuple"},{"components":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"bytes32[]","name":"siblings","type":"bytes32[]"}],"internalType":"struct Lib_OVMCodec.ChainInclusionProof","name":"stateRootProof","type":"tuple"},{"internalType":"bytes","name":"stateTrieWitness","type":"bytes"},{"internalType":"bytes","name":"storageTrieWitness","type":"bytes"}],"internalType":"struct IL1CrossDomainMessenger.L2MessageInclusionProof","name":"_proof","type":"tuple"}],"name":"relayMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"relayedMessages","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"address","name":"_sender","type":"address"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"uint256","name":"_queueIndex","type":"uint256"},{"internalType":"uint32","name":"_oldGasLimit","type":"uint32"},{"internalType":"uint32","name":"_newGasLimit","type":"uint32"}],"name":"replayMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"resolve","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"uint32","name":"_gasLimit","type":"uint32"}],"name":"sendMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"successfulMessages","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"xDomainMessageSender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
        }
    },
    l2: {
        //provider: 'wss://ws-kovan.optimism.io',
        //provider: 'https://kovan.optimism.io',
        provider: 'https://optimism-kovan.infura.io/v3/c6ab28412b494716bc5315550c0d4071',
        chain_id: 69,
        addresses: {
            /*dcn_contract_address: '0xB3e589F75534F4B43f739605cb5381dd572b3722',*/
            dcn_contract_address: '0xfd6ab60e0744e95c35fb17afda478eeae3835ddf',
            OVM_L1CrossDomainMessenger_address: '0xa172330C2E6Ec2bF04662Bb9b67ae857910b7f7f',
            OVM_L2StandardBridge_address: '0x4200000000000000000000000000000000000010',
            OVM_L2CrossDomainMessenger: '0x4200000000000000000000000000000000000007',
            OVM_StateCommitmentChain: '0xD7754711773489F31A0602635f3F167826ce53C5',
            DEPOSIT_API_L2_SENDER: '0xFB7442aC247ae842238B3e060cd8a5798c1969e3'
        },
        abi_definitions: {
            dcn_contract_abi: [{"inputs":[{"internalType":"address","name":"_l2Bridge","type":"address"},{"internalType":"address","name":"_l1Token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_account","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_account","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"l1Token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2Bridge","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"_interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}],
            OVM_L1CrossDomainMessenger_abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"FailedRelayedMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"_xDomainCalldataHash","type":"bytes32"}],"name":"MessageAllowed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"_xDomainCalldataHash","type":"bytes32"}],"name":"MessageBlocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"RelayedMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes","name":"message","type":"bytes"}],"name":"SentMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_xDomainCalldataHash","type":"bytes32"}],"name":"allowMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_xDomainCalldataHash","type":"bytes32"}],"name":"blockMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"blockedMessages","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_libAddressManager","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"libAddressManager","outputs":[{"internalType":"contract Lib_AddressManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"address","name":"_sender","type":"address"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"uint256","name":"_messageNonce","type":"uint256"},{"components":[{"internalType":"bytes32","name":"stateRoot","type":"bytes32"},{"components":[{"internalType":"uint256","name":"batchIndex","type":"uint256"},{"internalType":"bytes32","name":"batchRoot","type":"bytes32"},{"internalType":"uint256","name":"batchSize","type":"uint256"},{"internalType":"uint256","name":"prevTotalElements","type":"uint256"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct Lib_OVMCodec.ChainBatchHeader","name":"stateRootBatchHeader","type":"tuple"},{"components":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"bytes32[]","name":"siblings","type":"bytes32[]"}],"internalType":"struct Lib_OVMCodec.ChainInclusionProof","name":"stateRootProof","type":"tuple"},{"internalType":"bytes","name":"stateTrieWitness","type":"bytes"},{"internalType":"bytes","name":"storageTrieWitness","type":"bytes"}],"internalType":"struct iOVM_L1CrossDomainMessenger.L2MessageInclusionProof","name":"_proof","type":"tuple"}],"name":"relayMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"relayedMessages","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"address","name":"_sender","type":"address"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"uint256","name":"_queueIndex","type":"uint256"},{"internalType":"uint32","name":"_gasLimit","type":"uint32"}],"name":"replayMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"resolve","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"uint32","name":"_gasLimit","type":"uint32"}],"name":"sendMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"successfulMessages","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"xDomainMessageSender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
        }
    }
};

module.exports = {config_variable};