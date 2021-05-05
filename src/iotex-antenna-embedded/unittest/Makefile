AR		= $(CROSS_COMPILE)ar
CC		= $(CROSS_COMPILE)gcc
CXX		= $(CROSS_COMPILE)g++
LDSHFLAGS	= -rdynamic -shared 
ARFLAGS		= rcv
CFLAGS		= -Wall -g -fPIC -I../src -std=gnu99
#LDFLAGS		= -L.. -liotexemb -lcurl -L.. -ltrezor-crypto
LDFLAGS		= -L.. -liotexemb -lcurl

SRCS=$(wildcard *.c) $(wildcard *.cpp)
OBJDIR=../objs
SCRIPTS=../scripts
TARGETS=$(foreach src, $(SRCS), $(basename $(src)))

.PHONY:all clean objdir test no_int128
.SILENT:clean

all:objdir $(TARGETS)


objdir:
	@mkdir -p $(OBJDIR)

clean:
	$(RM) -rf *.o a.out depend.d $(TARGETS) $(OBJDIR)

$(TARGETS):
	@mkdir -p $(OBJDIR)
	$(CC) $(CFLAGS) -o $(OBJDIR)/$@ $^ $(LDFLAGS)

no_int128:
	@make clean && make CFLAGS="$(CFLAGS) -D_NO_128INT_"

# Test
curl_test: curl_test.o
pressure_test: pressure_test.o

# Unittest 
pb_unittest: pb_unittest.o
abi_unittest: abi_unittest.o
api_unittest: api_unittest.o
rule_unittest: rule_unittest.o
u128_unittest: u128_unittest.o
utils_unittest: utils_unittest.o
parse_unittest: parse_unittest.o
proto_unittest: proto_unittest.o
signer_unittest: signer_unittest.o
config_unittest: config_unittest.o
compose_url_test: compose_url_test.o
request_unittest: request_unittest.o

test:$(TARGETS)
	@chmod u+x $(SCRIPTS)/*.sh
	@make -C $(SCRIPTS)

no_int128_test:
	@make no_int128
	@make -C $(SCRIPTS)

depend.d:$(wildcard *.h *.c)
	$(CC) $(CFLAGS) -MM $^ > $@

-include depend.d
