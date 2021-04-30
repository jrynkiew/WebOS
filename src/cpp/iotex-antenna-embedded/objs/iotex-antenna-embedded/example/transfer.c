#include <stdio.h>
#include <stdlib.h>
#include "../src/iotex_emb.h"


int main(int argc, char **argv) {

    int ret;
    char *error_desc = NULL;
    char tx_amount_str[UINT128_RAW_MAX_LEN];
    iotex_t_hash tx_hash = {0};
    iotex_st_transfer tx = {0};
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

    /* Transfer */
    tx.amount = "123";
    tx.recipient = "io17awtxw3cm4hhku50nshw9250dfyfj576ykumrm";
    tx.core.privateKey = "dcdab70604b42d2a215263f5077ebbf6ceeffd46002249cb7e59015135e3bc91";

    /* Optional, can be NULL */
    tx.core.nonce = &nonce;
    tx.core.version = &version;
    tx.core.gasLimit = &gasLimit;
    tx.core.gasPrice  = "1000000000000";

    /* error_desc can be NULL, if don't care error reason */
    if ((ret = iotex_emb_transfer(&tx, tx_hash, &error_desc)) != 0) {

        if (error_desc) {
            fprintf(stderr, "Transfer failed: %s\n", error_desc);

            /* XXX: Notice, error_desc is malloced from iotex_emb_transfer, after use must free */
            free(error_desc);
            error_desc = NULL;
            return -1;
        }
        else {

            fprintf(stderr, "Transfer failed, error code: %d\n", ret);
            return -1;
        }
    }

    /* Get transfer action info */
    if ((ret = iotex_emb_get_action_by_hash(tx_hash, &tx_action_info)) != 0) {

        fprintf(stderr, "Get hash[%s] action failed: %d\n", tx_hash, ret);
        return -1;
    }

    /* Print tx info */
    u1282str(tx_action_info.action.core.transfer.amount, tx_amount_str, sizeof(tx_amount_str));
    fprintf(stdout, "Transfer success, amount: %s, recipient: %s, hash: %s\n", tx_amount_str, tx_action_info.action.core.transfer.recipient, tx_hash);

    return 0;
}

