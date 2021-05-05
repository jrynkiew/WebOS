#include <stdio.h>
#include "debug.h"
#include "unittest.h"
#include "../src/u128.h"


const char *nums[] = {

    "0",
    "12345",
    "18000000000000000000",
    "8703350000000000000000",
    "24197857200151252746022455506638221840",
    "340282366920938463463374607431768211455",
    NULL
};


const char *inval_nums[] = {

    "-0",
    "-1",
    "adadada212",
    "1321dazcsdsdadadad",
    NULL
};


void str2u128_test() {

    uint128_t u128;
    const char **test_str;
    char u128_str[UINT128_RAW_MAX_LEN];

    for (test_str = nums; *test_str; test_str++) {

        str2u128(*test_str, &u128);
        u1282str(u128, u128_str, sizeof(u128_str));
        UNITTEST_ASSERT_STR_EQ(*test_str, u128_str, strlen(*test_str));
    }

    for (test_str = inval_nums; *test_str; test_str++) {

        str2u128(*test_str, &u128);
        UNITTEST_ASSERT_EQ(u128_equal(u128, construct_u128("0")), 1);
    }

    UNITTEST_AUTO_PASS();
}


void u1282str_test() {

    char u128_str[UINT128_RAW_MAX_LEN];
    uint128_t zero = construct_u128("0");
    uint128_t number = construct_u128("12345");

    UNITTEST_ASSERT_NE(NULL, u1282str(zero, u128_str, 2));
    UNITTEST_ASSERT_STR_EQ(u1282str(zero, u128_str, 2), "0", strlen(u128_str));

    UNITTEST_ASSERT_EQ(NULL, u1282str(number, u128_str, 5));
    UNITTEST_ASSERT_NE(NULL, u1282str(number, u128_str, 6));
    UNITTEST_ASSERT_STR_EQ(u1282str(number, u128_str, 6), "12345", strlen(u128_str));

    UNITTEST_AUTO_PASS();
}


void u128_equal_test() {

    uint128_t a, b;
    const char **test_str;
    char u128_str[UINT128_RAW_MAX_LEN];

    for (test_str = nums; *test_str; test_str++) {

        str2u128(*test_str, &a);
        str2u128(*test_str, &b);
        u1282str(a, u128_str, sizeof(u128_str));
        UNITTEST_ASSERT_EQ(1, u128_equal(a, b));
        UNITTEST_ASSERT_STR_EQ(*test_str, u128_str, strlen(*test_str));
    }

    UNITTEST_AUTO_PASS();
}

void u128_compare_test() {

    UNITTEST_ASSERT_EQ(1, u128_is_less(construct_u128("12"), construct_u128("124")));
    UNITTEST_ASSERT_EQ(1, u128_is_less(construct_u128("123"), construct_u128("124")));
    UNITTEST_ASSERT_EQ(1, u128_is_less(construct_u128("123"), construct_u128("124")));
    UNITTEST_ASSERT_EQ(1, u128_is_less(construct_u128("8703350000000000000000"), construct_u128("8703350000000000000001")));
    UNITTEST_ASSERT_EQ(1, u128_is_less(construct_u128("8703350000000000000000112"), construct_u128("8703350000000000000000113")));
    UNITTEST_ASSERT_EQ(0, u128_is_less(construct_u128("8703350000000000000000112"), construct_u128("8703350000000000000000112")));

    UNITTEST_AUTO_PASS();
}

int main(int argc, char **argv) {

    str2u128_test();
    u1282str_test();
    u128_equal_test();
    u128_compare_test();
    return 0;
}
