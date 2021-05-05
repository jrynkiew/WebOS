#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "unittest.h"
#include "test_config.h"
#include "../src/debug.h"
#include "../src/u128.h"
#include "../src/config.h"
#include "../src/request.h"


static char url[IOTEX_EMB_MAX_URL_LEN];


void test_get_account() {

    const char *accounts[] = {

        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", NULL
    };

    for (int i = 0; accounts[i]; i++) {

        UNITTEST_ASSERT_NE(req_compose_url(url, sizeof(url), REQ_GET_ACCOUNT, accounts[i]), NULL);
        UNITTEST_ASSERT_EQ(url[strlen(url) - 1], i + '0');
    }

    UNITTEST_ASSERT_NE(req_compose_url(url, sizeof(url), REQ_GET_ACCOUNT, TEST_ACCOUNT_ADDR), NULL);
    UNITTEST_ASSERT_STR_EQ(url + strlen(url) - strlen(TEST_ACCOUNT_ADDR), TEST_ACCOUNT_ADDR, strlen(TEST_ACCOUNT_ADDR));

    UNITTEST_AUTO_PASS();
}


void test_get_chainmeta() {

    UNITTEST_ASSERT_NE(req_compose_url(url, sizeof(url), REQ_GET_CHAINMETA), NULL);
    UNITTEST_ASSERT_NE(url[strlen(url) - 1], '/');

    UNITTEST_ASSERT_NE(req_compose_url(url, sizeof(url), REQ_GET_CHAINMETA, 1, 2, 3), NULL);
    UNITTEST_ASSERT_NE(url[strlen(url) - 1], '/');

    UNITTEST_ASSERT_NE(req_compose_url(url, sizeof(url), REQ_GET_CHAINMETA, "nothing"), NULL);
    UNITTEST_ASSERT_NE(url[strlen(url) - 1], '/');

    UNITTEST_AUTO_PASS();
}


void test_get_action_by_hash() {

    UNITTEST_ASSERT_NE(req_compose_url(url, sizeof(url), REQ_GET_ACTIONS_BY_HASH, TEST_ACTION_HASH), NULL);
    UNITTEST_ASSERT_STR_EQ(url + strlen(url) - strlen(TEST_ACTION_HASH), TEST_ACTION_HASH, strlen(TEST_ACTION_HASH));

    UNITTEST_AUTO_PASS();
}


void test_get_action_by_addr() {

    uint32_t start, count;
    const char *start_ptr, *count_ptr, *addr_ptr;

    for (int i = 0; i < 100; i++) {

        start = random();
        count = random();

        UNITTEST_ASSERT_NE(req_compose_url(url, sizeof(url), REQ_GET_ACTIONS_BY_ADDR, TEST_ACTION_ADDR, start, count), NULL);
        UNITTEST_ASSERT_NE((start_ptr = strstr(url, "start")), NULL);
        UNITTEST_ASSERT_NE((count_ptr = strstr(url, "count")), NULL);
        UNITTEST_ASSERT_NE((addr_ptr = strstr(url, TEST_ACTION_ADDR)), NULL);
        UNITTEST_ASSERT_STR_EQ(addr_ptr, TEST_ACTION_ADDR, strlen(TEST_ACTION_ADDR));
    }

    UNITTEST_AUTO_PASS();
}


void test_transfers_by_block() {

    const char *blocks[] = {
        "1",
        "123",
        "12121212121",
        "43535555433434343",
        "212241313131213381313131",
        TEST_TRANSFERS_BLOCK,
        NULL
    };

    for (int i = 0; blocks[i]; i++) {
        UNITTEST_ASSERT_NE(req_compose_url(url, sizeof(url), REQ_GET_TRANSFERS_BY_BLOCK, blocks[i]), NULL);
        UNITTEST_ASSERT_STR_EQ(url + strlen(url) - strlen(blocks[i]), blocks[i], strlen(blocks[i]));
    }

    UNITTEST_AUTO_PASS();
}


void test_send_signed_action_bytes() {

    char url[IOTEX_EMB_MAX_URL_LEN + IOTEX_EMB_MAX_ACB_LEN];
    const char *signed_action_bytes = "0a4c0801107b18f8062203393939523e0a033435361"
                                      "229696f313837777a703038766e686a6a706b79646e"
                                      "723937716c68386b683064706b6b797466616d386a1"
                                      "a0c68656c6c6f20776f726c64211241044e18306ae9"
                                      "ef4ec9d07bf6e705442d4d1a75e6cdf750330ca2d88"
                                      "0f2cc54607c9c33deb9eae9c06e06e04fe9ce3d4396"
                                      "2cc67d5aa34fbeb71270d4bad3d648d91a41555cc8a"
                                      "f4181bf85c044c3201462eeeb95374f78aa48c67b87"
                                      "510ee63d5e502372e53082f03e9a11c1e351de539ce"
                                      "df85d8dff87de9d003cb9f92243541541a000";

    UNITTEST_ASSERT_NE(NULL, req_compose_url(url, sizeof(url), REQ_SEND_SIGNED_ACTION_BYTES, signed_action_bytes));
    UNITTEST_ASSERT_STR_EQ(url + strlen(url) - strlen(signed_action_bytes), signed_action_bytes, strlen(signed_action_bytes));

    UNITTEST_AUTO_PASS();
}


int main(int argc, char **argv) {


    test_get_account();
    test_get_chainmeta();
    test_get_action_by_hash();
    test_get_action_by_addr();
    test_transfers_by_block();
    test_send_signed_action_bytes();
    return 0;
}
