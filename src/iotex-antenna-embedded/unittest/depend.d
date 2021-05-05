test_config.o: test_config.h
unittest.o: unittest.h
abi_unittest.o: abi_unittest.c unittest.h ../src/abi_pack.h \
 ../src/abi_read_contract.h ../src/endian_conv.h ../src/signer.h
api_unittest.o: api_unittest.c ../src/debug.h ../src/config.h unittest.h \
 test_config.h ../src/u128.h ../src/debug.h ../src/parse.h \
 ../src/request.h ../src/iotex_emb.h ../src/u128.h
compose_url_test.o: compose_url_test.c unittest.h test_config.h \
 ../src/debug.h ../src/u128.h ../src/config.h ../src/request.h
config_unittest.o: config_unittest.c unittest.h ../src/config.h \
 ../src/iotex_emb.h ../src/u128.h
curl_test.o: curl_test.c ../src/config.h ../src/iotex_emb.h ../src/u128.h
parse_unittest.o: parse_unittest.c ../src/debug.h ../src/config.h \
 unittest.h test_config.h ../src/u128.h ../src/debug.h ../src/rule.h \
 ../src/parse.h ../src/parse.h ../src/request.h ../src/iotex_emb.h \
 ../src/u128.h
pb_unittest.o: pb_unittest.c unittest.h test_config.h ../src/debug.h \
 ../src/signer.h ../src/pb_pack.h
pressure_test.o: pressure_test.c test_config.h ../src/iotex_emb.h \
 ../src/u128.h
proto_unittest.o: proto_unittest.c unittest.h ../src/debug.h \
 ../src/signer.h ../src/pb_proto.h ../src/pb_pack.h ../src/iotex_emb.h \
 ../src/u128.h
request_unittest.o: request_unittest.c ../src/config.h unittest.h \
 test_config.h ../src/debug.h ../src/request.h ../src/iotex_emb.h \
 ../src/u128.h ../src/parse.h ../src/signer.h ../src/abi_read_contract.h
rule_unittest.o: rule_unittest.c ../src/debug.h ../src/config.h \
 unittest.h test_config.h ../src/rule.h ../src/parse.h ../src/iotex_emb.h \
 ../src/u128.h
signer_unittest.o: signer_unittest.c unittest.h test_config.h \
 ../src/debug.h ../src/signer.h
u128_unittest.o: u128_unittest.c ../src/debug.h unittest.h ../src/u128.h
utils_unittest.o: utils_unittest.c ../src/utils.h unittest.h
