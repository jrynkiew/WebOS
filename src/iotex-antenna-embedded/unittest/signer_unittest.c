#include <stdio.h>
#include "unittest.h"
#include "test_config.h"
#include "../src/debug.h"
#include "../src/signer.h"

void test_hex_parse() {

    int i;
    const char *str[] = {
        TEST_ACTION_HASH,
        TEST_TRANSFERS_BLOCK_ACTHASH,
        TEST_TRANSFERS_BLOCK_BLKHASH,
        NULL
    };

    uint8_t hex[128];
    char hex_str[256];
    int hex_len, str_len;

    for (i = 0; str[i]; i++) {

        hex_len = signer_str2hex(str[i], hex, sizeof(hex));
        UNITTEST_ASSERT_NE(hex_len, -1);

        str_len = signer_hex2str(hex, hex_len, hex_str, sizeof(hex_str));
        UNITTEST_ASSERT_NE(str_len, -1);

        UNITTEST_ASSERT_EQ(str_len, strlen(str[i]));
        UNITTEST_ASSERT_STR_EQ(str[i], hex_str, str_len);
    }

    UNITTEST_ASSERT_EQ(-1, signer_str2hex("1212 s!@", hex, sizeof(hex)));
    UNITTEST_AUTO_PASS();
}


int main(int argc, char **argv) {

    test_hex_parse();
    return 0;
}
