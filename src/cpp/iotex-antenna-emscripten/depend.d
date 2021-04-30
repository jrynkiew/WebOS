config.o: src/config.c src/config.h src/iotex_emb.h src/u128.h
request.o: src/request.c src/debug.h src/config.h src/request.h \
  src/iotex_emb.h src/u128.h
endian_conv.o: src/endian_conv.c src/endian_conv.h
response.o: src/response.c src/rule.h src/parse.h src/debug.h \
  src/config.h src/signer.h src/request.h src/response.h src/iotex_emb.h \
  src/u128.h src/pb_proto.h src/pb_pack.h
pb_pack.o: src/pb_pack.c src/pb_pack.h src/endian_conv.h
parse.o: src/parse.c src/u128.h src/jsmn.h src/debug.h src/parse.h
rule.o: src/rule.c src/rule.h src/parse.h src/debug.h src/iotex_emb.h \
  src/u128.h
u128.o: src/u128.c src/u128.h
utils.o: src/utils.c
signer.o: src/signer.c src/crypto/secp256k1.h src/crypto/ecdsa.h \
  src/crypto/bignum.h src/crypto/options.h src/crypto/sha3.h \
  src/signer.h
iotex_emb.o: src/iotex_emb.c src/u128.h src/rule.h src/parse.h \
  src/debug.h src/signer.h src/config.h src/request.h src/response.h \
  src/iotex_emb.h src/pb_proto.h src/pb_pack.h
ecdsa.o: src/crypto/ecdsa.c src/crypto/bignum.h src/crypto/options.h \
  src/crypto/ecdsa.h src/crypto/memzero.h src/crypto/rand.h \
  src/crypto/rfc6979.h src/crypto/hmac_drbg.h src/crypto/sha2.h \
  src/crypto/secp256k1.h
rfc6979.o: src/crypto/rfc6979.c src/crypto/rfc6979.h src/crypto/bignum.h \
  src/crypto/options.h src/crypto/hmac_drbg.h src/crypto/sha2.h \
  src/crypto/memzero.h
bignum.o: src/crypto/bignum.c src/crypto/bignum.h src/crypto/options.h \
  src/crypto/memzero.h
sha3.o: src/crypto/sha3.c src/crypto/sha3.h src/crypto/options.h \
  src/crypto/memzero.h
memzero.o: src/crypto/memzero.c
rand.o: src/crypto/rand.c src/crypto/rand.h
sha2.o: src/crypto/sha2.c src/crypto/sha2.h src/crypto/memzero.h
hmac_drbg.o: src/crypto/hmac_drbg.c src/crypto/hmac_drbg.h \
  src/crypto/sha2.h src/crypto/memzero.h
secp256k1.o: src/crypto/secp256k1.c src/crypto/secp256k1.h \
  src/crypto/ecdsa.h src/crypto/bignum.h src/crypto/options.h \
  src/crypto/secp256k1.table
abi_read_contract.o: src/abi_read_contract.c src/abi_read_contract.h \
  src/endian_conv.h
pb_proto.o: src/pb_proto.c src/signer.h src/pb_proto.h src/pb_pack.h \
  src/iotex_emb.h src/u128.h
abi_pack.o: src/abi_pack.c src/abi_pack.h src/endian_conv.h
endian_conv.o: src/endian_conv.h
response.o: src/response.h src/iotex_emb.h src/u128.h src/parse.h
pb_pack.o: src/pb_pack.h
pb_proto.o: src/pb_proto.h src/pb_pack.h
abi_pack.o: src/abi_pack.h
request.o: src/request.h
iotex_emb.o: src/iotex_emb.h src/u128.h
rule.o: src/rule.h src/parse.h
utils.o: src/utils.h
jsmn.o: src/jsmn.h
sha3.o: src/crypto/sha3.h src/crypto/options.h
bignum.o: src/crypto/bignum.h src/crypto/options.h
options.o: src/crypto/options.h
hmac_drbg.o: src/crypto/hmac_drbg.h src/crypto/sha2.h
memzero.o: src/crypto/memzero.h
ecdsa.o: src/crypto/ecdsa.h src/crypto/bignum.h src/crypto/options.h
rfc6979.o: src/crypto/rfc6979.h src/crypto/bignum.h src/crypto/options.h \
  src/crypto/hmac_drbg.h src/crypto/sha2.h
secp256k1.o: src/crypto/secp256k1.h src/crypto/ecdsa.h \
  src/crypto/bignum.h src/crypto/options.h
sha2.o: src/crypto/sha2.h
rand.o: src/crypto/rand.h
parse.o: src/parse.h
abi_read_contract.o: src/abi_read_contract.h
signer.o: src/signer.h
u128.o: src/u128.h
debug.o: src/debug.h
config.o: src/config.h
