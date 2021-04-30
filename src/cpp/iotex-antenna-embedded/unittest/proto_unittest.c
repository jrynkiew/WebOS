#include <stdio.h>
#include "unittest.h"
#include "../src/debug.h"
#include "../src/signer.h"
#include "../src/pb_proto.h"
#include "../src/iotex_emb.h"


void test_transfer_action() {

    uint64_t version = 1;
    uint64_t nonce = 123;
    uint64_t gasLimit = 888;
    const char *gasPrice = "999";
    const char *tx_amount = "456";
    const char *tx_payload = "68656c6c6f20776f726c6421";
    const char *tx_recipient = "io187wzp08vnhjjpkydnr97qlh8kh0dpkkytfam8j";
    const char *private_key_str = "0806c458b262edd333a191e92f561aff338211ee3e18ab315a074a2d82aa343f";

    int tx_payload_len, action_byte_len, str_len;
    uint8_t action_hash[SIG_HASH_SIZE];
    uint8_t tx_payload_hex[128];
    uint8_t action_bytes[256];
    char str_buffer[512];
    iotex_st_transfer tx;

    tx_payload_len = signer_str2hex(tx_payload, tx_payload_hex, sizeof(tx_payload_hex));
    UNITTEST_ASSERT_NE(-1, tx_payload_len);

    tx.core.version = &version;
    tx.core.nonce = &nonce;
    tx.core.gasLimit = &gasLimit;
    tx.core.gasPrice = gasPrice;
    tx.core.privateKey = private_key_str;

    tx.amount = tx_amount;
    tx.recipient = tx_recipient;
    tx.payload = tx_payload_hex;
    tx.payloadLength = tx_payload_len;

    /* Generate tx action bytes */
    action_byte_len = proto_gen_tx_action(&tx, action_bytes, sizeof(action_bytes));
    UNITTEST_ASSERT_NE(action_byte_len, -1);

    str_len = signer_hex2str(action_bytes, action_byte_len, str_buffer, sizeof(str_buffer));
    UNITTEST_ASSERT_STR_EQ(str_buffer, "0a4c0801107b18f8062203393939523e0a033435361229696f313837777a703038766e686a6a706b79646e723937716c68386b683064706b6b797466616d386a1a0c68656c6c6f20776f726c64211241044e18306ae9ef4ec9d07bf6e705442d4d1a75e6cdf750330ca2d880f2cc54607c9c33deb9eae9c06e06e04fe9ce3d43962cc67d5aa34fbeb71270d4bad3d648d91a41555cc8af4181bf85c044c3201462eeeb95374f78aa48c67b87510ee63d5e502372e53082f03e9a11c1e351de539cedf85d8dff87de9d003cb9f92243541541a000", str_len);

    /* Calc action bytes hash */
    memset(str_buffer, 0, sizeof(str_buffer));
    signer_get_hash(action_bytes, action_byte_len, action_hash);
    str_len = signer_hex2str(action_hash, sizeof(action_hash), str_buffer, sizeof(str_buffer));
    UNITTEST_ASSERT_STR_EQ(str_buffer, "6c84ac119058e859a015221f87a4e187c393d0c6ee283959342eac95fad08c33", str_len);

    UNITTEST_AUTO_PASS();
}


int main(int argc, char **argv) {

    test_transfer_action();
}
