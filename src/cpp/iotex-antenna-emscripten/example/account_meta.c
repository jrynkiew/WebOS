#include <stdio.h>
#include "u128.h"
#include "iotex_emb.h"


int main(int argc, char **argv) {
    printf("test\n");
    int ret;
    iotex_st_config config = {0};
    iotex_st_account_meta account;
    char u128_str[UINT128_RAW_MAX_LEN];
    const char *account_address = (argc >= 2) ? argv[1] : "io1e2nqsyt7fkpzs5x7zf2uk0jj72teu5n6aku3tr";

    /* Configure cert file */
    config.cert_file = "cacert.pem";

    if ((ret = iotex_emb_init(&config)) != 0) {
        fprintf(stderr, "Initialize iotex emb failed, error code: %d\n", ret);
        return -1;
    }

    /* Get account metadata */
    if ((ret = iotex_emb_get_account_meta(account_address, &account)) != 0) {
        fprintf(stderr, "Get account metadata failed, error code: %d\n", ret);
        return -1;
    }

    fprintf(stdout, "Account: %s, balance: %s\n", account.address, u1282str(account.balance, u128_str, sizeof(u128_str)));

    /* Not required */
    iotex_emb_exit();
    return 0;
}

