#pragma once
#include "WebOS.h"
#include <vector>

class EasyCurl
{
private:
    ImVector<const char*> CommandParameters;
    //curl -X POST -H "Content-Type:application/json" --data '{"id": 1, "jsonrpc": "2.0", "method": "eth_getBalance", "params": ["0xE584ca6F469c11140Bb9c4617Cb8f373E38C5D46", ""]}' https://babel-api.testnet.iotex.io
    std::string method;
    std::vector<const char*> headers;
    std::string data;
    std::string url;

    CURL *curl;
    CURLcode res;

    std::string * consoleBufferPtr;

    static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void* userp)
    {
        EasyCurl* _this = (EasyCurl*)userp;
        //_this->consoleBufferPtr->append((char*)contents, size * nmemb);
        //_this->consoleBufferPtr->append(std::string("\n"));
        _this->AddLog((char*)contents);
        success_fetch_pflag = true;
        return size * nmemb;
    }

    #if defined(__EMSCRIPTEN__)
        static void onLoaded(emscripten_fetch_t *fetch) 
        {
            std::string success = std::string("Finished downloading " + std::to_string(fetch->numBytes) + " bytes from: " + fetch->url);
            EasyCurl* _this = (EasyCurl*)fetch->userData;
            //console->consoleBuffer.append((char*)fetch->data, fetch->totalBytes);
            //console->consoleBuffer.append(std::string("\n"));
            _this->AddLog(success.data());
            _this->AddLog((char*)fetch->data);
            emscripten_fetch_close(fetch);
        }
        static void onError(emscripten_fetch_t *fetch)
        {
            std::string error = std::string("[error] Connection Failed!\n") + fetch->url + " - HTTP failure status code: " + std::to_string(fetch->status);
            EasyCurl* _this = (EasyCurl*)fetch->userData;
            _this->AddLog(error.data());
            emscripten_fetch_close(fetch);
        }
    #endif

    /* data */
public:
    int Stricmprlx(const char* str1, const char* str2) { int d; while ((d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; if(*str1 == ' ') {return d;} if(!*str2) {return d;}} return d; }
    int Stricmp(const char* str1, const char* str2) { int d; while ((d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; } return d; }
    char *strmbtok ( char *input, char *delimit, char *openblock, char *closeblock) {
        static char *token = NULL;
        char *lead = NULL;
        char *block = NULL;
        int iBlock = 0;
        int iBlockIndex = 0;

        if ( input != NULL) {
            token = input;
            lead = input;
        }
        else {
            lead = token;
            if ( *token == '\0') {
                lead = NULL;
            }
        }

        while ( *token != '\0') {
            if ( iBlock) {
                if ( closeblock[iBlockIndex] == *token) {
                    iBlock = 0;
                }
                token++;
                continue;
            }
            if ( ( block = strchr ( openblock, *token)) != NULL) {
                iBlock = 1;
                iBlockIndex = block - openblock;
                token++;
                continue;
            }
            if ( strchr ( delimit, *token) != NULL) {
                *token = '\0';
                token++;
                break;
            }
            token++;
        }
        return lead;
    }

    void setMethod(const char * _method) { method = _method;}
    void setHeaders(std::vector<const char*> _headers) { headers = _headers;}
    
    const char * getMethod() { return method.data(); }
    const char ** getHeaders() { return headers.data(); }
    std::string wrapDoubleQuotes(const char * _str) { std::string result; if(*_str != '\"') { result = '"'; result += _str; result += '"';}  return result; }
    std::string wrapSingleQuotes(const char * _str) { std::string result; if(*_str != '\'') { result = "'"; result += _str; result += "'";}  return result; }
    

    void execute_command(const char* command_line)
    {
        CommandParameters.clear(); //clear past parameters from previous calls to easycurl 
        char * command_line_copy = strdup(command_line); //we copy the parameter so that we don't lose the data when tokenizing it
        char *token;
        char acOpen[]  = {"\"\'"}; //can specify any character to start the "block" on, like { < [ etc
        char acClose[] = {"\"\'"}; //same as above, but to close
        //char acStr[] = {"this contains \'blocks \"a [quoted\" block\" and a [bracketed \"block]' and <other ]\" blocks>\""};

        token = strmbtok ( command_line_copy, " ", acOpen, acClose);
        while ( ( token = strmbtok ( NULL, " ", acOpen, acClose)) != NULL) {
            CommandParameters.push_back(token);
        }
        if(CommandParameters.size() == 1) //if only 1 parameter in commandParameter,s it means that only "curl was called with no parameters" -> Display help.
        {
            printCurlHelp();
        }
        for(int i=0; i<CommandParameters.size(); i++)
        {
            if(Stricmprlx(CommandParameters[i], "-") == 0)
            {
                if(Stricmprlx(CommandParameters[i], "--") == 0)
                {
                    if(Stricmp(CommandParameters[i], "--data") == 0)
                    {
                        if(CommandParameters.size() > i+1)
                        {
                            data = wrapSingleQuotes(CommandParameters[i+1]);
                        } 
                    }
                    else if(Stricmp(CommandParameters[i], "--help") == 0)
                    {
                        printCurlHelp();
                    }
                } 
                switch (CommandParameters[i][1]) {
                    case 'X':
                        if(CommandParameters.size() > i+1)
                        {
                            if(Stricmp(CommandParameters[i+1], "POST") == 0)
                            {
                                method = "POST";
                            }
                        }
                        break;
                     case 'h':
                        printCurlHelp();
                        break;
                    case 'H':
                        if(CommandParameters.size() > i+1)
                        {
                            char * headerData = strdup(CommandParameters[i+1]); //we copy the parameter so that we don't lose the data when tokenizing it
                            char *s, *d;
                            for (s=d=headerData;*d=*s;d+=(*s++!='"')); //remove the extra " from beginning and end
                            char * tok = strtok(headerData, ":");
                            while(tok != NULL) { //divide up the passed parameters into tokens based : delimiter
                                headers.push_back(tok);
                                tok = strtok(NULL, ":");
                            }
                            headers.push_back(0);
                            //for (int p = 0; p < headers.size(); p++)
                              //  AddLog(headers[p]); //headers contains the tokenized parameters for header data in an array like <key,value,key,value,...>
                        }
                        break;
                    case 'd':
                        if(CommandParameters.size() > i+1)
                        {
                            data = wrapSingleQuotes(CommandParameters[i+1]);
                        } 
                        break;
                }
            }
            if((Stricmprlx(CommandParameters[i], "http://") == 0) || (Stricmp(CommandParameters[i], "http://") == 0))
            {
                url = CommandParameters[i];
                post(method.data(), headers.data(), data.data(), url.data());
            }
            AddLog(CommandParameters[i]);
        }
    }

    void AddLog(const char* str)
    {
        consoleBufferPtr->append(str);
        consoleBufferPtr->append("\n");
    }

    void printCurlHelp()
    {
        AddLog(
            "[info] Usage: curl [options...] <url>\n \
            -d, --data <data>   HTTP POST data (partial support)\n \
            -f, --fail          Fail silently (no output at all) on HTTP errors (no support)\n \
            -h, --help <category> Get help for commands\n \
            -H, --header <header/@file> Extra header to include in the request\n \
            -i, --include       Include protocol response headers in the output (no support)\n \
            -o, --output <file> Write to file instead of stdout (no support)\n \
            -O, --remote-name   Write output to a file named as the remote file (no support)\n \
            -s, --silent        Silent mode (no support)\n \
            -T, --upload-file <file> Transfer local FILE to destination (no support)\n \
            -u, --user <user:password> Server user and password (no support)\n \
            -A, --user-agent <name> Send User-Agent <name> to server (no support)\n \
            -v, --verbose       Make the operation more talkative (no support)\n \
            -V, --version       Show version number and quit (no support)\n \
            -X, --request <command> Specify custom request method (partial support)"
        );
    }

    void post(const char * method, const char * headers[], const char * data, const char * URL)
    {
        if ((URL != NULL) && (URL[0] != '\0')) 
        {     
            if ((Stricmprlx(URL, "http://") == 0) || (Stricmprlx(URL, "https://") == 0)) 
            {   
                #if defined(__EMSCRIPTEN__)
                    emscripten_fetch_attr_t attr;
                    emscripten_fetch_attr_init(&attr);
                    strcpy(attr.requestMethod, method);
                    attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
                    attr.onsuccess = onLoaded;
                    attr.onerror = onError;
                    attr.userData = (void*)this;
                    attr.requestHeaders = headers;
                    attr.requestData = data;
                    attr.requestDataSize = strlen(data);

                    emscripten_fetch(&attr, URL);
                #else
                    curl = curl_easy_init();
                    if(curl) 
                    {
                        curl_easy_setopt(curl, CURLOPT_URL, URL);
                        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
                        curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void*)this);
                        res = curl_easy_perform(curl);
                        curl_easy_cleanup(curl);
                    }  
                #endif
            }
            else 
            {  
                AddLog("[info] Correct usage: POST [url]");
            }
        }
        else 
        { 
            AddLog("[info] Correct usage: POST [url]");
        }
    }

    EasyCurl(std::string* _consoleBuffer);
    ~EasyCurl();
};

EasyCurl::EasyCurl(std::string* _consoleBuffer)
{
    consoleBufferPtr = _consoleBuffer;
}

EasyCurl::~EasyCurl()
{
}