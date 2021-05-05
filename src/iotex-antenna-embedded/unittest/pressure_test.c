#include <stdio.h>
#include <stdlib.h>
#include "test_config.h"
#include "../src/iotex_emb.h"


#define __output(ret)  do {fprintf(stdout, "\"%s\": %d, ", __func__, ret); fflush(stdout); } while (0)
#define __output_end(ret)  do {fprintf(stdout, "\"%s\": %d", __func__, ret); fflush(stdout); } while (0)

void get_chain_meta(void) {

    iotex_st_chain_meta meta;
    __output(iotex_emb_get_chain_meta(&meta));
}

void get_account_meta(void) {

    iotex_st_account_meta meta;
    __output(iotex_emb_get_account_meta(TEST_ACCOUNT_ADDR, &meta));
}

void get_action_by_hash(void) {

    iotex_st_action_info info;
    __output(iotex_emb_get_action_by_hash(TEST_ACTION_HASH, &info));
}

void get_action_by_addr(void) {

    size_t actual_size;
    size_t max_size = 100;
    iotex_st_action_info *actions;

    if (!(actions = calloc(sizeof(iotex_st_action_info), max_size))) {

        __output(-2);
        return;
    }

    if (iotex_emb_get_action_by_addr(TEST_ACCOUNT_ADDR, 0, max_size, actions, max_size, &actual_size) == 0 && actual_size > 1) {

        __output(0);
    }
    else {

        __output(-1);
    }

    free(actions);
}

void get_transfer_by_block(void) {

    uint128_t block;
    iotex_st_action_info info;
    str2u128(TEST_TRANSFERS_BLOCK, &block);

    if (iotex_emb_get_transfer_block(block, &info) == 0 && u128_equal(block, info.blkHeight)) {

        __output(0);
    }
    else {

        __output(-1);
    }
}


void get_get_validators(void) {

    size_t actual_size;
    size_t max_size = 100;
    iotex_st_validator *validators;

    if (!(validators = calloc(sizeof(iotex_st_validator), max_size))) {

        __output(-2);
    }

    __output_end(iotex_emb_get_validators(validators, max_size, &actual_size));
    free(validators);
}


/*
 * source ../scripts/env.sh
 * ../objs/pressure_test 1000 ../example/cacert.pem > result.json
 *
 */
int main(int argc, char **argv) {

    uint32_t i;
    uint32_t test_times = (argc >= 2) ? atoi(argv[1]) : -1;
    const char *cert_file = (argc >= 3) ? argv[3] : "../example/cacert.pem";

    iotex_st_config config = {0};
    config.cert_file = cert_file;

    if (iotex_emb_init(&config) != 0 ) {

        fprintf(stderr, "Something wrong!!!\n");
        return -1;
    }


    fprintf(stdout, "[");

    for (i = 0; i < test_times; i++) {

        fprintf(stdout, "{");

        get_chain_meta();
        get_account_meta();
        get_action_by_hash();
        get_action_by_addr();
        get_transfer_by_block();
        get_get_validators();

        if (i + 1 == test_times) {

            fprintf(stdout, "}");
        }
        else {

            fprintf(stdout, "}, ");
        }

        fflush(stdout);
    }

    fprintf(stdout, "]\n");
}
