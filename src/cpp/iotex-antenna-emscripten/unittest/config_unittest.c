#include <stdio.h>
#include "unittest.h"
#include "../src/config.h"
#include "../src/iotex_emb.h"


void test_iotex_emb_init() {

    iotex_st_config config;

    config = get_config();
    UNITTEST_ASSERT_EQ(config.ver, 0);
    UNITTEST_ASSERT_EQ(config.cert_dir, NULL);
    UNITTEST_ASSERT_EQ(config.cert_file, NULL);

    UNITTEST_ASSERT_EQ(0, iotex_emb_init(NULL));

    config = get_config();
    UNITTEST_ASSERT_EQ(config.ver, 1);
    UNITTEST_ASSERT_NE(config.cert_dir, NULL);
    UNITTEST_ASSERT_NE(config.cert_file, NULL);

    iotex_emb_exit();
    UNITTEST_AUTO_PASS();
}

void test_iotex_emb_init_with_version() {

    iotex_st_config config = {0};

    config = get_config();
    UNITTEST_ASSERT_EQ(config.ver, 0);
    UNITTEST_ASSERT_EQ(config.cert_dir, NULL);
    UNITTEST_ASSERT_EQ(config.cert_file, NULL);

    /* V1 */
    config.ver = 1;
    UNITTEST_ASSERT_EQ(0, iotex_emb_init(&config));

    config = get_config();
    UNITTEST_ASSERT_EQ(config.ver, 1);
    UNITTEST_ASSERT_NE(config.cert_dir, NULL);
    UNITTEST_ASSERT_NE(config.cert_file, NULL);

    iotex_emb_exit();
    UNITTEST_AUTO_PASS();
}

int main(int argc, char **argv) {

    test_iotex_emb_init();
    test_iotex_emb_init_with_version();
    return 0;
}
