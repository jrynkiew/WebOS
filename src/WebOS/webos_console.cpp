#include "webos_console.h"

webos_console::webos_console(/* args */)
{
    ClearLog();
    memset(InputBuf, 0, sizeof(InputBuf));
    HistoryPos = -1;
    Commands.push_back("HELP\n");
    Commands.push_back("HISTORY\n");
    Commands.push_back("CLEAR\n");
    Commands.push_back("FETCH [url]\n");
    Commands.push_back("IOCTL\n");
    Commands.push_back("CURL\n");
    AutoScroll = true;
    ScrollToBottom = false;

    consoleBuffer.append("[warning] This feature is still under development \n");
}

const void webos_console::Draw(const char* title, bool* p_open)
    {
        if (!ImGui::Begin(title, p_open))
        {
            ImGui::End();
            return;
        }
        if (ImGui::BeginPopupContextItem())
        {
            if (ImGui::MenuItem("Close"))
                *p_open = false;
            ImGui::EndPopup();
        }
        ImGui::TextWrapped("Enter 'HELP' for help, press TAB to use text completion.");
           
        if (ImGui::SmallButton("Connect ioPay Wallet"))  { 
            consoleBuffer.append("Running command: ./ioctl bc info \n");
            //fetch("https://89.70.221.154/");
        } 

        ImGui::SameLine();
        if (ImGui::SmallButton("Commit Transaction")) { 
            consoleBuffer.append("[error] Wallet not connected \n");
        } ImGui::SameLine();
        if (ImGui::SmallButton("Clear")) { ClearLog(); } ImGui::SameLine();
        bool copy_to_clipboard = ImGui::SmallButton("Copy");

        const float footer_height_to_reserve = ImGui::GetStyle().ItemSpacing.y + ImGui::GetFrameHeightWithSpacing(); // 1 separator, 1 input text
        ImGui::BeginChild("ScrollingRegion", ImVec2(0, -footer_height_to_reserve), false, ImGuiWindowFlags_HorizontalScrollbar); // Leave room for 1 separator + 1 InputText
        if (ImGui::BeginPopupContextWindow())
        {
            if (ImGui::Selectable("Clear")) ClearLog();
            ImGui::EndPopup();
        }

        ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(4,1)); // Tighten spacing
        if (copy_to_clipboard)
            ImGui::LogToClipboard();
        
        ImGui::InputTextMultiline("Console", (char*)consoleBuffer.c_str(), strlen(consoleBuffer.c_str()), ImVec2(ImGui::GetWindowContentRegionMax().x, ImGui::GetWindowContentRegionMax().y), ImGuiInputTextFlags_ReadOnly);
    
        if (copy_to_clipboard)
            ImGui::LogFinish();

        if ((AutoScroll && ImGui::GetScrollY() >= ImGui::GetScrollMaxY()))
        {
            ImGui::GetID("Console");
            ImGui::SetScrollHereY();
        }

        ImGui::PopStyleVar();
        ImGui::EndChild();

        bool reclaim_focus = false;
        if (ImGui::InputText("Input", InputBuf, IM_ARRAYSIZE(InputBuf), ImGuiInputTextFlags_EnterReturnsTrue|ImGuiInputTextFlags_CallbackCompletion|ImGuiInputTextFlags_CallbackHistory, &InputCallback, (void*)this))
        {
            char* s = InputBuf;
            Strtrim(s);
            if (s[0])
                ExecCommand(s);
            strcpy(s, "");
            reclaim_focus = true;
        }

        // Auto-focus on window apparition
        ImGui::SetItemDefaultFocus();
        if (reclaim_focus)
            ImGui::SetKeyboardFocusHere(-1); // Auto focus previous widget

        ImGui::End();
    }

void webos_console::ExecCommand(const char* command_line)
{
    //test direct console output manipulation
    consoleBuffer += "# > ";
    consoleBuffer += command_line;
    consoleBuffer += "\n";
    
    // Process command
    if (Stricmprlx(command_line, "CLEAR") == 0)
    {
        ClearLog();
    }
    else if (Stricmprlx(command_line, "HELP") == 0)
    {
        char * token = strtok((char *)command_line, " ");
        consoleBuffer.append("Commands: \n");
        for (int i = 0; i < Commands.Size; i++)
        {
            consoleBuffer.append("- ");
            consoleBuffer.append(Commands[i]);
        }
    }
    else if (Stricmprlx(command_line, "IOCTL") == 0)
    {
        AddLog(command_line);
        //char * token = strtok((char *)command_line, " ");
        //post("https://89.70.221.154/", command_line);

    }
    else if (Stricmprlx(command_line, "CURL") == 0)
    {
        char * requestData;
        char * command_line_copy = strdup(command_line);
        char * token = strtok((char *)command_line_copy, " "); //tokenize the command into parameters
        
        if((token = strtok(NULL," ")) && token) // first parameter of CURL command
        {     
            if(Stricmprlx(token, "http") == 0) //if it's just curl http (website request) return fetch command
                //fetch(token); 
                AddLog(command_line);
            else {
                execute_curl_command(command_line); //else try to process command
            }
            //curl -X POST -H "Content-Type:application/json" --data '{"id": 1, "jsonrpc": "2.0", "method": "eth_getBalance", "params": ["0xE584ca6F469c11140Bb9c4617Cb8f373E38C5D46", ""]}' http://babel-api.mainnet.iotex.io:8545
            //      ^
            //if(easyCurl->Stricmp(command_line, "-X")
        }
        else {
            execute_curl_command(command_line);
        }
        //char * token = strtok((char *)command_line, " ");
        //post("https://babel-api.testnet.iotex.io", token);
    }
    else if (Stricmprlx(command_line, "HISTORY") == 0)
    {
        int first = History.Size - 10;
        for (int i = first > 0 ? first : 0; i < History.Size; i++)
        {
            consoleBuffer.append(std::to_string(i));
            consoleBuffer.append(History[i]);
            consoleBuffer.append(" \n");
        }
    }
    else if (Stricmprlx(command_line, "FETCH") == 0)
    {
        char * token = strtok((char *)command_line, " ");
        token = strtok(NULL," "); //second parameter         
        //fetch(token); 
        AddLog(command_line);
    }
    else
    {
        consoleBuffer.append("[error] Unknown command: ");
        consoleBuffer.append(command_line);
        consoleBuffer.append("\n");
    }
    ScrollToBottom = true;
}

void webos_console::execute_curl_command(const char* command_line)
{
    char * command_line_copy = strdup(command_line); //we copy the parameter so that we don't lose the data when tokenizing it
    char *token;
    char acOpen[]  = {"\"\'"}; //can specify any character to start the "block" on, like { < [ etc
    char acClose[] = {"\"\'"}; //same as above, but to close
    //char acStr[] = {"this contains \'blocks \"a [quoted\" block\" and a [bracketed \"block]' and <other ]\" blocks>\""};

    token = Strmbtok ( command_line_copy, " ", acOpen, acClose); //first command (just curl)
    while ( ( token = Strmbtok ( NULL, " ", acOpen, acClose)) != NULL) { //token is now at the second parameter, if exists)
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

void webos_console::post(const char * method, void * userp, const char * data, const char * URL)
{
    webos_console* _this = (webos_console*)userp;
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
                    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, curl_headers);

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

    CommandParameters.clear(); //clear past parameters from previous calls to easycurl 
    #if defined(__EMSCRIPTEN__)
    emsc_headers.clear(); //clear past parameters from previous calls to easycurl. All other parameters are one line strings which get overwritten naturally
    #else
    curl_slist_free_all(curl_headers);
    #endif

}

void webos_console::AddLog(const char* str, ...) IM_FMTARGS(2)
{
    char buf[32000];
    va_list args;
    va_start(args, str);
    vsnprintf(buf, sizeof(buf), str, args);
    buf[sizeof(buf)-1] = 0;
    va_end(args);

    consoleBuffer.append(buf);
    consoleBuffer.append("\n");
}

void webos_console::ClearLog()
{
    consoleBuffer.clear();
}

void webos_console::printCurlHelp()
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

webos_console::~webos_console()
{
    ClearLog();
    for (int i = 0; i < History.Size; i++)
        free(History[i]);
}

