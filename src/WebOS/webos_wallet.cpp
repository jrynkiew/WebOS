#include "webos_wallet.h"


webos_wallet::webos_wallet(/* args */)
{
}

webos_wallet::~webos_wallet()
{}

void webos_wallet::init()
{
    connectWallet();
}

bool webos_wallet::checkWalletStatus()
{
    #if defined(__EMSCRIPTEN__)
    return MAIN_THREAD_EM_ASM_INT({
        if(window.antenna) {
            if(window.antenna.iotx.signer.ws.readyState === 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }           
    });
    #else
    return false;
    #endif
}

void webos_wallet::connectWallet() 
{
    #if defined(__EMSCRIPTEN__)
    MAIN_THREAD_ASYNC_EM_ASM({    
        Asyncify.handleAsync(async () => {  
            window.antenna = await new Antenna("https://api.iotex.one:443", {
                signer: await new WsSignerPlugin
            });
            await new Promise(resolve => setTimeout(resolve, 1500))
        });
    });
    #endif
}