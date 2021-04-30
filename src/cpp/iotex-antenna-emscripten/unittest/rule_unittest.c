#include <stdio.h>
#include <stdlib.h>
#include "debug.h"
#include "config.h"
#include "unittest.h"
#include "test_config.h"
#include "../src/rule.h"
#include "../src/iotex_emb.h"

void test_iotex_st_action_info_bind() {

    int i;
    iotex_st_action_info action[10];
    json_parse_rule *found_action, *found_core, *found_transfer, *found;

    json_parse_rule core_transfer_rule[] = {

        {"amount", JSON_TYPE_NUMBER},
        {"recipient", JSON_TYPE_STR},
        {NULL}
    };

    json_parse_rule action_core_rule[] = {

        {"nonce", JSON_TYPE_NUMBER},
        {"version", JSON_TYPE_NUMBER},
        {"gasLimit", JSON_TYPE_NUMBER},
        {"gasPrice", JSON_TYPE_NUMBER},
        {"transfer", JSON_TYPE_OBJECT, core_transfer_rule},
        {NULL}
    };

    json_parse_rule action_rule[] = {

        {"signature", JSON_TYPE_STR},
        {"senderPubKey", JSON_TYPE_STR},
        {"core", JSON_TYPE_OBJECT, action_core_rule},
        {NULL}
    };

    json_parse_rule action_info_rule[] = {

        {"action", JSON_TYPE_OBJECT, action_rule},
        {"actHash", JSON_TYPE_STR},
        {"blkHash", JSON_TYPE_STR},
        {"blkHeight", JSON_TYPE_NUMBER},
        {"sender", JSON_TYPE_STR},
        {"gasFee", JSON_TYPE_NUMBER},
        {"timestamp", JSON_TYPE_STR},
        {NULL}
    };

    for (i = 0; i < sizeof(action) / sizeof(action[0]); i++) {

        /* Bind rule and iotex_st_action_info */
        rule_action_info_bind(action_info_rule, (void *)(action + i));

        /* iotex_st_action_info */
        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(action_info_rule, "actHash"))));
        UNITTEST_ASSERT_EQ(found->value, action[i].actHash);
        UNITTEST_ASSERT_EQ(found->value_len, sizeof(action[i].actHash));

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(action_info_rule, "blkHash"))));
        UNITTEST_ASSERT_EQ(found->value, action[i].blkHash);
        UNITTEST_ASSERT_EQ(found->value_len, sizeof(action[i].blkHash));


        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(action_info_rule, "blkHeight"))));
        UNITTEST_ASSERT_EQ(found->value, &action[i].blkHeight);
        UNITTEST_ASSERT_EQ(found->value_len, 0);

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(action_info_rule, "sender"))));
        UNITTEST_ASSERT_EQ(found->value, action[i].sender);
        UNITTEST_ASSERT_EQ(found->value_len, sizeof(action[i].sender));

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(action_info_rule, "gasFee"))));
        UNITTEST_ASSERT_EQ(found->value, &action[i].gasFee);
        UNITTEST_ASSERT_EQ(found->value_len, 0);

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(action_info_rule, "timestamp"))));
        UNITTEST_ASSERT_EQ(found->value, action[i].timestamp);
        UNITTEST_ASSERT_EQ(found->value_len, sizeof(action[i].timestamp));

        /* iotex_st_action_info.action */
        UNITTEST_ASSERT_NE(NULL, ((found_action = find_sub_rule_by_key(action_info_rule, "action"))));

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(found_action, "signature"))));
        UNITTEST_ASSERT_EQ(found->value, action[i].action.signature);
        UNITTEST_ASSERT_EQ(found->value_len, sizeof(action[i].action.signature));

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(found_action, "senderPubKey"))));
        UNITTEST_ASSERT_EQ(found->value, action[i].action.senderPubKey);
        UNITTEST_ASSERT_EQ(found->value_len, sizeof(action[i].action.senderPubKey));

        /* iotex_st_action_info.action.core */
        UNITTEST_ASSERT_NE(NULL, ((found_core = find_sub_rule_by_key(found_action, "core"))));

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(found_core, "nonce"))));
        UNITTEST_ASSERT_EQ(found->value, &action[i].action.core.nonce);
        UNITTEST_ASSERT_EQ(found->value_len, 0);

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(found_core, "version"))));
        UNITTEST_ASSERT_EQ(found->value, &action[i].action.core.version);
        UNITTEST_ASSERT_EQ(found->value_len, 0);

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(found_core, "gasLimit"))));
        UNITTEST_ASSERT_EQ(found->value, &action[i].action.core.gasLimit);
        UNITTEST_ASSERT_EQ(found->value_len, 0);

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(found_core, "gasPrice"))));
        UNITTEST_ASSERT_EQ(found->value, &action[i].action.core.gasPrice);
        UNITTEST_ASSERT_EQ(found->value_len, 0);

        /* iotex_st_action_info.action.core.transfer */
        UNITTEST_ASSERT_NE(NULL, ((found_transfer = find_sub_rule_by_key(found_core, "transfer"))));

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(found_transfer, "amount"))));
        UNITTEST_ASSERT_EQ(found->value, &action[i].action.core.transfer.amount);
        UNITTEST_ASSERT_EQ(found->value_len, 0);

        UNITTEST_ASSERT_NE(NULL, ((found = find_rule_by_key(found_transfer, "recipient"))));
        UNITTEST_ASSERT_EQ(found->value, action[i].action.core.transfer.recipient);
        UNITTEST_ASSERT_EQ(found->value_len, sizeof(action[i].action.core.transfer.recipient));
    }

    UNITTEST_AUTO_PASS();
}


int main(int argc, char **argv) {

    test_iotex_st_action_info_bind();
}
