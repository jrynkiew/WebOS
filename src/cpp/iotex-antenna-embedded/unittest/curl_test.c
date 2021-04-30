#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <curl/curl.h>
#include "config.h"
#include "iotex_emb.h"

int main(int argc, char **argv) {

    if (argc < 2) {

        fprintf(stdout, "Usage: %s <url> [enable_post] [header_file_path]\n", argv[0]);
        return -1;
    }

    /* Auto search cert */
    iotex_emb_init(NULL);
    iotex_st_config config = get_config();

    CURL *curl;
    CURLcode res;
    FILE *header_file = NULL;
    const char *input_url = argv[1];
    int enable_post = (argc >= 3) ? 1 : 0;
    const char *header_file_path = (argc >= 4) ? argv[3] : NULL;

    if (header_file_path) {

        if (!(header_file = fopen(header_file_path, "wb"))) {

            fprintf(stderr, "Open header file: %s, error: %s\n",
                    header_file_path, strerror(errno));
        }
    }

    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();

    if (curl) {

        curl_easy_setopt(curl, CURLOPT_URL, input_url);

        if (header_file) {

            curl_easy_setopt(curl, CURLOPT_HEADERDATA, header_file);
        }

        if (enable_post) {

            curl_easy_setopt(curl, CURLOPT_POST, 1L);
            curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, 0L);
        }

        /* Set the file with the certs vaildating the server */
        curl_easy_setopt(curl, CURLOPT_CAINFO, config.cert_file);
        curl_easy_setopt(curl, CURLOPT_CAPATH, config.cert_dir);

        /* Disconnect if we can't validate server's cert */
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, config.verify_cert);

        /* Verify the cert's name against host */
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, config.verify_host);

        /* Perform the request, res will get the return code */
        res = curl_easy_perform(curl);

        /* Check for errors */
        if (res != CURLE_OK) {

            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        }

        /* always cleanup */
        curl_easy_cleanup(curl);
    }

    curl_global_cleanup();

    return 0;
}

