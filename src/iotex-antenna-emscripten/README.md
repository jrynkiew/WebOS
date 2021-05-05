# iotex-antenna-embedded 

iotex-antenna-embedded is our C/C++ SDK allowing you to interact with a local or remote iotex block chain node, using https connection

## Build

```
// Linux/macOS
cd iotex-antenna-embedded && make 

// cross compile
cd iotex-antenna-embedded && make CROSS_COMPILE=xxxxxx

// run unittest
make unittest

// build example
make example

// archiving libs docs and example
make release
```

## Third Party Modules

- http request:  https://github.com/curl/curl 
- Josn parse: https://github.com/zserge/jsmn. 
- Hash and signature calculate: https://github.com/trezor/trezor-crypto 

## Configure

For Linux Distributions or mac OS , you may do not need any configure, just call `iotex_emb_init(NULL)`,  then using the API interact  with a iotex block chain node. 

For embedded Linux device, you may need configure the cert file or directory, to tell library where to find the SSL Certificate. Configure cert by passing a `iotex_emb_config` structure to `iotex_emb_init`.

```c
typedef struct iotex_st_config {
    uint32_t ver;		// pharos API version, default 1
    long verify_cert;		// set 1 verify the pharos SSL certificate
    long verify_host;		// set 2 verify the certificate's name against host
    const char *cert_dir;	// SSL certificate directory, set NULL will auto search
    const char *cert_file;	// SSL certificate file, set NULL will auto search
} iotex_st_config;
```

**Notice**

For easy use `iotex_emb_init` wouldn't copy  `iotex_st_config.cert_dir\cert_file` content, so it must pointer to an static char string such as static variable or Macro. For Linux Distributions or mac OS, you may set NULL let software auto search certificate and directory. 

## Interfaces

All of iotex-antenna-embedded API, return zero means success, failed will return a negative error code, error code's meaning you can reference `iotex_em_error`. 

For some system do not support ` __uint128_t`,  define Macro `_NO_128INT_` (`make no_int128`  ), it will use 40 bytes raw string instead. Also `u128` module provides a series of functions to uniform process 128 bit numbers.

All exports data structure and API start with `iotex` prefix

- api: `iotex_emb_`
- struct: `iotex_st_`
- enum: `iotex_em_`

## Example

```c
#include <stdio.h>
#include "u128.h"
#include "iotex_emb.h"

int main(int argc, char **argv) {

    int ret;
    iotex_st_config config = {0};
    iotex_st_account_meta account;
    char u128_str[UINT128_RAW_MAX_LEN];
    const char *account_address = (argc >= 2) ? argv[1] : "io1e2nqsyt7fkpzs5x7zf2uk0jj72teu5n6aku3tr";

    /* Configure cert file */
    config.cert_file = "cacert.pem";

    if ((ret = iotex_emb_init(&config)) != 0) {

        fprintf(stderr, "Initialize iotex emb failed, error code: %d\n", ret);
        return -1;
    }

    /* Get account metadata */
    if ((ret = iotex_emb_get_account_meta(account_address, &account)) != 0) {

        fprintf(stderr, "Get account metadata failed, error code: %d\n", ret);
        return -1;
    }

    fprintf(stdout, "Account: %s, balance: %s\n", account.address, u1282str(account.balance, u128_str, sizeof(u128_str)));

    /* Not required */
    iotex_emb_exit();
    return 0;
}
```



## Run example

```
// make
cd example && make

// set running env
source ../scripts/env.sh

// run
../objs/account_meta
../objs/transfer
```

