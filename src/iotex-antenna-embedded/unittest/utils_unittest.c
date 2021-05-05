#include "utils.h"
#include "unittest.h"
#include <stdio.h>


void test_input() {
    char iotx[32];
    UNITTEST_ASSERT_EQ(utils_rau2iotx("1", NULL, 0), NULL);
    UNITTEST_ASSERT_EQ(utils_rau2iotx("1", iotx, 20), NULL);
    UNITTEST_ASSERT_NE(utils_rau2iotx("1", iotx, 21), NULL);
    UNITTEST_AUTO_PASS();
}

void test_transform() {
    char iotx[64];
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("0", iotx, sizeof(iotx)), "0", 1);
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("00000000000000000000000", iotx, sizeof(iotx)), "0", 1);

    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("1000000000000000000", iotx, sizeof(iotx)), "1", strlen("1"));
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("10000000000000000000", iotx, sizeof(iotx)), "10", strlen("10"));
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("11000000000000000000", iotx, sizeof(iotx)), "11", strlen("11"));
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("100000000000000000000", iotx, sizeof(iotx)), "100", strlen("100"));
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("110000000000000000000", iotx, sizeof(iotx)), "110", strlen("110"));

    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("1000000000000000001", iotx, sizeof(iotx)), "1.000000000000000001", strlen("1.000000000000000001"));

    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("1100000000000000000", iotx, sizeof(iotx)), "1.1", strlen("1.1"));
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("1010000000000000000", iotx, sizeof(iotx)), "1.01", strlen("1.01"));
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("10000000000000000000000000000", iotx, sizeof(iotx)), "10000000000", strlen("10000000000"));

    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("1", iotx, sizeof(iotx)), "0.000000000000000001", strlen(iotx));
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("1", iotx, sizeof(iotx)), "0.000000000000000001", strlen(iotx));
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("10", iotx, sizeof(iotx)), "0.00000000000000001", strlen(iotx));
    UNITTEST_ASSERT_STR_EQ(utils_rau2iotx("100", iotx, sizeof(iotx)), "0.0000000000000001", strlen(iotx));
    UNITTEST_AUTO_PASS();
}

int main(int argc, char **argv) {
    char iotx[32];
    const char *amount[] = {
        "0",
        "1",
        "100",
        "00",
        "000",
        "0000",
        "0000000000000000000",
        "1100000000000000000",
        "1020000000000000000",
        "1030000000000001000",
        "1030000000000000001",
        "100000000000000000000",
        "000000000000000000000000",
        "0000000000000000000000000000000",
    };

    for (int i = 0; i < UNITTEST_GET_ARRAY_SIZE(amount); i++) {
        fprintf(stdout, "%s ==> %s\n", amount[i], utils_rau2iotx(amount[i], iotx, sizeof(iotx)));
    }

    test_input();
    test_transform();

    return 0;
}
