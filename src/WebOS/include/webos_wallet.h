#include <string>
#if defined(__EMSCRIPTEN__)
#include <emscripten.h>
#endif

class webos_wallet
{
private:
    std::string address;

    /* data */
public:

    void init();
    void connectWallet();
    bool checkWalletStatus();
    
    webos_wallet(/* args */);
    ~webos_wallet();
};

