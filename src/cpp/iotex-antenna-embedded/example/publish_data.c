#include <stdio.h>
#include <stdlib.h>
#include "../src/iotex_emb.h"
#include "../src/abi_pack.h"

int main(int argc, char **argv) {

    int ret;
    char *error_desc = NULL;
    iotex_st_execution tx = {0};
    iotex_t_hash tx_hash = {0};
    iotex_st_config config = {0};
    iotex_st_action_info tx_action_info;
    uint64_t version = 1, nonce = 1, gasLimit = 1000000;

    config.ver = 1;
    config.cert_file = "cacert.pem";

    /* Initialize iotex emb lib */
    if ((ret = iotex_emb_init(&config)) != 0) {
        fprintf(stderr, "Initialize iotex emb failed, error code: %d\n", ret);
        return -1;
    }

    /* Execution */
    tx.amount = "0";  // 0 since the contract below is not payable
    tx.contract = "io1jjwlujpk7wztptwdjvun268ccsadsd7dtl2alq";
    tx.core.privateKey = "dcdab70604b42d2a215263f5077ebbf6ceeffd46002249cb7e59015135e3bc91";

    /* Optional, can be NULL */
    tx.core.nonce = &nonce;
    tx.core.version = &version;
    tx.core.gasLimit = &gasLimit;
    tx.core.gasPrice  = "1000000000000";

    // assume data[40] contains the 40-bytes we want to publish to contract
    char data[40];
    uint64_t data_size;

    if ((tx.data = abi_pack_publish((const uint8_t *)data, 40, &data_size)) == NULL) {
        return IOTEX_E_MEM;
    }

    tx.dataLength = data_size;

    /* error_desc can be NULL, if don't care error reason */
    if ((ret = iotex_emb_execution(&tx, tx_hash, &error_desc)) != 0) {
        if (error_desc) {
            fprintf(stderr, "Execution failed: %s\n", error_desc);

            /* XXX: Notice, error_desc is malloced from iotex_emb_transfer, after use must free */
            free(error_desc);
            error_desc = NULL;
            ret = -1;
        }
        else {
            fprintf(stderr, "Execution failed, error code: %d\n", ret);
        }

        // tx.data is malloced by abi_pack_publish(), free before exit
        free(tx.data);
        tx.data = NULL;
        return ret;
    }

    /* Get transfer action info */
    if ((ret = iotex_emb_get_action_by_hash(tx_hash, &tx_action_info)) != 0) {
        fprintf(stderr, "Get hash[%s] action failed: %d\n", tx_hash, ret);

        // tx.data is malloced by abi_pack_publish(), free before exit
        free(tx.data);
        tx.data = NULL;
        return ret;
    }

    /* Print tx info */
    // TODO: parse execution into tx_action_info
    fprintf(stdout, "Execution success, amount: %s, contract: %s, hash: %s\n", tx.amount, tx.contract, tx_hash);

    // tx.data is malloced by abi_pack_publish(), free before exit
    free(tx.data);
    tx.data = NULL;
    return 0;
}
