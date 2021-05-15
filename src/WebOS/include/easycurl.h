#pragma once
#include <vector>

class EasyCurl
{
private:
    ImVector<const char*> CommandParameters;
    //curl -X POST -H "Content-Type:application/json" --data '{"id": 1, "jsonrpc": "2.0", "method": "eth_getBalance", "params": ["0xE584ca6F469c11140Bb9c4617Cb8f373E38C5D46", ""]}' https://babel-api.testnet.iotex.io
    std::string method;
    std::vector<const char*> emsc_headers; //for emscripten
    struct curl_slist *curl_headers=NULL; //for binaries using curl natively

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
        return size * nmemb;
    }

    #if defined(__EMSCRIPTEN__)
        static void onLoaded(emscripten_fetch_t *fetch) 
        {
            std::string success = std::string("Finished downloading " + std::to_string(fetch->numBytes) + " bytes from: " + fetch->url);
            std::string result = result.append((char*)fetch->data, fetch->totalBytes);

            EasyCurl* _this = (EasyCurl*)fetch->userData;

            _this->AddLog(success.data());
            _this->AddLog(result.data());

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
    char *strmbtok ( char *input, char *delimit, char *openblock, char *closeblock) { static char *token = NULL; char *lead = NULL; char *block = NULL; int iBlock = 0; int iBlockIndex = 0; if ( input != NULL) { token = input; lead = input; } else { lead = token; if ( *token == '\0') { lead = NULL; } } while ( *token != '\0') { if ( iBlock) { if ( closeblock[iBlockIndex] == *token) { iBlock = 0; } token++; continue; } if ( ( block = strchr ( openblock, *token)) != NULL) { iBlock = 1; iBlockIndex = block - openblock; token++; continue; } if ( strchr ( delimit, *token) != NULL) { *token = '\0'; token++; break; } token++; } return lead; }

    void setMethod(const char * _method) { method = _method;}
    void setHeaders(std::vector<const char*> _headers) { emsc_headers = _headers;}
    
    const char * getMethod() { return method.data(); }
    const char ** getHeaders() { return emsc_headers.data(); }
    std::string wrapDoubleQuotes(const char * _str) { std::string result; if(*_str != '\"') { result = '"'; result += _str; result += '"';}  return result; }
    std::string wrapSingleQuotes(const char * _str) { std::string result; if(*_str != '\'') { result = "'"; result += _str; result += "'";}  return result; }
    

    void execute_command(const char* command_line)
    {
        char * command_line_copy = strdup(command_line); //we copy the parameter so that we don't lose the data when tokenizing it
        char *token;
        char acOpen[]  = {"\"\'"}; //can specify any character to start the "block" on, like { < [ etc
        char acClose[] = {"\"\'"}; //same as above, but to close
        //char acStr[] = {"this contains \'blocks \"a [quoted\" block\" and a [bracketed \"block]' and <other ]\" blocks>\""};

        token = strmbtok ( command_line_copy, " ", acOpen, acClose); //first command (just curl)
        while ( ( token = strmbtok ( NULL, " ", acOpen, acClose)) != NULL) { //token is now at the second parameter, if exists)
            CommandParameters.push_back(token);
        }
        if(CommandParameters.size() <= 1) //if only 1 parameter in commandParameter,s it means that only "curl was called with no parameters" -> Display help.
        {
            AddLog("curl -X POST -H \"Accept:application/wasm\" -H \"Content-Type:application/json\" --data \'{\"id\": 1, \"jsonrpc\": \"2.0\", \"method\": \"eth_getBalance\", \"params\": [\"0xE584ca6F469c11140Bb9c4617Cb8f373E38C5D46\", \"\"]}\' https://babel-api.testnet.iotex.io");
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
                            char *s, *d;
                            char * tmpdata = strdup(CommandParameters[i+1]);
                            for (s=d=tmpdata;*d=*s;d+=(*s++!='\''));
                            data = tmpdata;
                        }  else {printCurlHelp();}
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
                        } else {printCurlHelp();}
                        break;
                     case 'h':
                        printCurlHelp();
                        break;
                    case 'H':
                        if(CommandParameters.size() > i+1)
                        {
                            #if defined(__EMSCRIPTEN__)
                            char * headerData = strdup(CommandParameters[i+1]); //we copy the parameter so that we don't lose the data when tokenizing it
                            char *s, *d;
                            for (s=d=headerData;*d=*s;d+=(*s++!='"')){}; //remove the extra " from beginning and end
                            char * tok = strtok(headerData, ":");
                            while(tok != NULL) { //divide up the passed parameters into tokens based : delimiter
                                emsc_headers.push_back(tok);
                                tok = strtok(NULL, ":");
                            }
                            
                            #else
                            char * headerData = strdup(CommandParameters[i+1]); //we copy the parameter so that we don't lose the data when tokenizing it
                            char *s, *d;
                            for (s=d=headerData;*d=*s;d+=(*s++!='"')){}; //remove the extra " from beginning and end
                            curl_headers = curl_slist_append(curl_headers, headerData);
                            
                            #endif
                            //for (int p = 0; p < headers.size(); p++)
                              //  AddLog(headers[p]); //headers contains the tokenized parameters for header data in an array like <key,value,key,value,...>
                        } else {printCurlHelp();}
                        break;
                    case 'd':
                        /*if(CommandParameters.size() > i+1)
                        {
                            char *f, *b;
                            char * tmpdata = strdup(CommandParameters[i+1]);
                            for (f=b=tmpdata;*f=*b;f+=(*b++!='\''));
                            data = tmpdata;
                        }  else {printCurlHelp();}*/
                        break;
                }
            }
            if((Stricmprlx(CommandParameters[i], "https://") == 0) || (Stricmp(CommandParameters[i], "http://") == 0))
            {
                url = CommandParameters[i];
                AddLog("URL: %s", url.data());
                AddLog("METHOD: %s", method.data());
                AddLog("data: %s", data.data());
                #if defined(__EMSCRIPTEN__)
                for(int i=0; i<emsc_headers.size(); i++)
                    AddLog("headers: %s", emsc_headers[i]);
                emsc_headers.push_back(0);
                post(method.data(), (void*)this, data.data(), url.data());
                #else
                for(int i=0; i<emsc_headers.size(); i++)
                    AddLog("headers: %s", emsc_headers[i]);
                post(method.data(), (void*)this, data.data(), url.data());
                #endif
            }
            //AddLog(CommandParameters[i]);
        }
    }

    void AddLog(const char* str, ...) IM_FMTARGS(2)
    {
        char buf[32000];
        va_list args;
        va_start(args, str);
        vsnprintf(buf, sizeof(buf), str, args);
        buf[sizeof(buf)-1] = 0;
        va_end(args);

        consoleBufferPtr->append(buf);
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

    void post(const char * method, void * userp, const char * data, const char * URL)
    {
        EasyCurl* _this = (EasyCurl*)userp;
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
                    attr.requestHeaders = _this->emsc_headers.data();
                    attr.requestData = data;
                    attr.requestDataSize = strlen(data);

                    emscripten_fetch(&attr, URL);
                #else
                    
                    curl = curl_easy_init();
                    if(curl) 
                    {
                        if(Stricmp(method, "POST") == 0)
                        {
                            curl_easy_setopt(curl, CURLOPT_POST, 1);
                        }
                        curl_easy_setopt(curl, CURLOPT_URL, URL);
                        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data);
                        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
                        curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void*)this);
                        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, _this->curl_headers);

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

        _this->CommandParameters.clear(); //clear past parameters from previous calls to easycurl 
        #if defined(__EMSCRIPTEN__)
        _this->emsc_headers.clear(); //clear past parameters from previous calls to easycurl. All other parameters are one line strings which get overwritten naturally
        #else
        curl_slist_free_all(curl_headers);
        #endif

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
