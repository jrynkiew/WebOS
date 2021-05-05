#include <stdio.h>
#include <stdlib.h>
#include "config.h"
#include "unittest.h"
#include "test_config.h"
#include "../src/debug.h"
#include "../src/request.h"
#include "../src/iotex_emb.h"
#include "../src/parse.h"
#include "../src/signer.h"
#include "../src/abi_read_contract.h"


#define MAX_RESPONSE_LEN (16 * 1024)
static char response_buf[MAX_RESPONSE_LEN];

int basic_request(iotex_em_request req, const char *args) {

    char url[IOTEX_EMB_MAX_URL_LEN];

    if (!req_compose_url(url, sizeof(url), req, args)) {

        return -1;
    }

    __INFO_MSG__(url);

    if (req_get_request(url, response_buf, sizeof(response_buf)) != 0) {

        return -1;
    }

    __INFO_MSG__(response_buf);
    return 0;
}


void test_get_account_info(const char *addr) {

    UNITTEST_AUTO_TRUE(basic_request(REQ_GET_ACCOUNT, addr) == 0);
}


void test_get_chainmeta() {

    UNITTEST_AUTO_TRUE(basic_request(REQ_GET_CHAINMETA, NULL) == 0);
}

void test_get_transfers_by_block(const char *block) {

    char url[IOTEX_EMB_MAX_URL_LEN];

    if (!req_compose_url(url, sizeof(url), REQ_GET_TRANSFERS_BY_BLOCK, block)) {

        UNITTEST_FAIL("req_compose_url");
        return;
    }

    __INFO_MSG__(url);

    if (req_get_request(url, response_buf, sizeof(response_buf)) != 0) {

        UNITTEST_FAIL("req_send_request");
        return;
    }

    __INFO_MSG__(response_buf);
    UNITTEST_AUTO_PASS();
}

void test_get_actions_by_hash(const char *hash) {

    UNITTEST_AUTO_TRUE(basic_request(REQ_GET_ACTIONS_BY_HASH, hash) == 0);
}

void test_get_actions_by_addr(const char *addr, uint32_t start, uint32_t count) {

    char url[IOTEX_EMB_MAX_URL_LEN];

    if (!req_compose_url(url, sizeof(url), REQ_GET_ACTIONS_BY_ADDR, addr, start, count)) {

        UNITTEST_FAIL("req_compose_url");
        return;
    }

    __INFO_MSG__(url);

    if (req_get_request(url, response_buf, sizeof(response_buf)) != 0) {

        UNITTEST_FAIL("req_send_request");
        return;
    }

    __INFO_MSG__(response_buf);
    UNITTEST_AUTO_PASS();
}

void test_get_member_validators() {

    char url[IOTEX_EMB_MAX_URL_LEN];

    if (!req_compose_url(url, sizeof(url), REQ_GET_MEMBER_VALIDATORS)) {

        UNITTEST_FAIL("req_compose_url");
        return;
    }

    __INFO_MSG__(url);

    if (req_get_request(url, response_buf, sizeof(response_buf)) != 0) {

        UNITTEST_FAIL("req_send_request");
        return;
    }

    __INFO_MSG__(response_buf);
    UNITTEST_AUTO_PASS();
}

void test_act_transfer() {

    char url[1024];
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


    if (!req_compose_url(url, sizeof(url), REQ_SEND_SIGNED_ACTION_BYTES, signed_action_bytes)) {

        UNITTEST_FAIL("req_compose_url");
        return;
    }

    __INFO_MSG__(url);

    if (req_post_request(url, response_buf, sizeof(response_buf)) != 0) {

        UNITTEST_FAIL("req_send_request");
        return;
    }

    __INFO_MSG__(response_buf);
    UNITTEST_AUTO_PASS();
}

void test_get_contract_data() {
    char url[IOTEX_EMB_MAX_URL_LEN];    

    req_compose_url(url, sizeof(url),
        REQ_READ_CONTRACT_BY_ADDR,
        "io1zclqa7w3gxpk47t3y3g9gzujgtl44lastfth28", "c5934222", "0000000000000000000000000000000000333532363536313030373934363132");

    const char *dataURL = "https://pharos.iotex.io/v1/contract/addr/io1zclqa7w3gxpk47t3y3g9gzujgtl44lastfth28?method=c5934222&data=0000000000000000000000000000000000333532363536313030373934363132";
    UNITTEST_ASSERT_STR_EQ(dataURL, url, strlen(url));

    iotex_st_contract_data contract_data;
    json_parse_rule contract_rules[] = {
        {"data", JSON_TYPE_STR, NULL, (void *)contract_data.data, sizeof(contract_data.data)},
        {NULL}
    };

    const char *response = "{\"data\":\"00000000000000000000000000000000000000000000000000000000005f77f80000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000013747279706562626c652e696f2f3132333435360000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066162636465660000000000000000000000000000000000000000000000000000\"}";
    UNITTEST_ASSERT_EQ(0, json_parse_response(response, contract_rules));

    // contract_data->data is hex-encoded string, convert back to bytes
    size_t size = strlen(contract_data.data)/2;
    UNITTEST_ASSERT_EQ(size, signer_str2hex(contract_data.data, (uint8_t *)contract_data.data, size));
    contract_data.size = size;
    UNITTEST_ASSERT_EQ(256, contract_data.size);

    // verify parsing order info from contract data
    UNITTEST_ASSERT_EQ(6256632, abi_get_order_start(contract_data.data, contract_data.size));
    UNITTEST_ASSERT_EQ(4, abi_get_order_duration(contract_data.data, contract_data.size));
    const char *result = abi_get_order_endpoint(contract_data.data, contract_data.size);
    UNITTEST_ASSERT_STR_EQ("trypebble.io/123456", result, strlen(result));
    result = abi_get_order_token(contract_data.data, contract_data.size);
    UNITTEST_ASSERT_STR_EQ("abcdef", result, strlen(result));
    UNITTEST_AUTO_PASS();
}

int main(int argc, char **argv) {

    iotex_emb_init(NULL);

    test_get_contract_data();
    test_get_chainmeta();
    test_get_account_info(TEST_ACCOUNT_ADDR);
    test_get_actions_by_hash(TEST_ACTION_HASH);
    test_get_actions_by_addr(TEST_ACCOUNT_ADDR, 0, 2);
    test_get_transfers_by_block(TEST_TRANSFERS_BLOCK);
    test_get_member_validators();

    test_act_transfer();
}
