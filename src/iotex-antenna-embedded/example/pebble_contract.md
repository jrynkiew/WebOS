## Interact with pebble contract 

Pebble contract is deployed on mainnet to administer pebble device registration and subscription. 

You can use a device's ID to read its order information, and send IoT data to the subscriber's storage endpoint.

```c
const char *pebble = "io1zclqa7w3gxpk47t3y3g9gzujgtl44lastfth28"; // to be replaced by actual contract address
const char *method = "c5934222";
const char *data = "0000000000000000000000000000000000333532363536313030373934363132"; // hex-encoded string of 32-byte device ID
iotex_st_contract_data contract_data = {};

// read the device's order info from contract
if (iotex_emb_read_contract_by_addr(pebble, method, data, &contract_data) != 0) {
    // error handling
}

// parse order info
uint64_t start = abi_get_order_start(contract_data.data, contract_data.size); // starting block subscriber paid to receive data
uint32_t duration = abi_get_order_duration(contract_data.data, contract_data.size); // number of blocks subscriber paid to receive data
const char *endpoint = abi_get_order_endpoint(contract_data.data, contract_data.size); // subscriber's storage endpoint address
const char *token = abi_get_order_token(contract_data.data, contract_data.size); // subscriber's storage endpoint token

// calculate the duration we need to send IoT data
iotex_st_chain_meta meta = {};
if (iotex_emb_get_chain_meta(&chain) != 0) {
    // error handling
}


if (start + duration > chain.height) {
    duration = (start + duration - chain.height) * 5;
} else {
    // subscription already expired
    duration = 0;
}

if (duration > 0) {
    // start sending data to the subscriber's storage endpoint for 'duration' seconds
}

// free the endpoint and token
free(endpoint);
endpoint = NULL;
free(token);
token = NULL;
```
