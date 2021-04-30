AR		= $(CROSS_COMPILE)ar
CC		= $(CROSS_COMPILE)cc

LDSHFLAGS	= -rdynamic -shared 
ARFLAGS		= rcv
CFLAGS		= -Wall -g -fPIC -I../src -I..

EMS 		+= --preload-file cacert.pem --use-preload-plugins
EMS 		+= -s ALLOW_MEMORY_GROWTH=1
EMS 		+= -s DISABLE_EXCEPTION_CATCHING=1 -s EXIT_RUNTIME=1
EMS 		+= -s ASSERTIONS=1 -s SAFE_HEAP=1 
CFLAGS += $(EMS)

#LDFLAGS		= -L.. -llibiotexemscripten -lcurl -L.. -ltrezor-crypto
LDFLAGS		= -L.. -liotexemscripten

SRCS=$(wildcard *.c) $(wildcard *.cpp)
OBJDIR=out
SCRIPTS=../scripts
TARGETS=$(foreach src, $(SRCS), $(basename $(src)))
#TARGETS=$(foreach src, $(SRCS), $(addsuffix .js, $(basename $(src))))

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

# Examples
transfer: transfer.o
account_meta: account_meta.o
publish_data: publish_data.o

depend.d:$(wildcard *.h *.c)
	$(CC) $(CFLAGS) -MM $^ > $@

-include depend.d
