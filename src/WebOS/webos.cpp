#pragma once
#include "webos.h"

WebOS::WebOS() {
	//Initiate connection to ImGui Style pointer
	this->imGuiStylePtr = &ImGui::GetStyle();

    // Initialize Command Console
    
    //Load WebOS icons
    webos_icon*	icon_JRPC = new webos_icon("images/io1m43dzu4q5klmhu9yffperyrugu8dag58kq9syu.png", 32, 32);
    icons.push_back(icon_JRPC);
    webos_icon* icon_WebOS = new webos_icon("images/wallpaper.png", 32, 32);
    icons.push_back(icon_WebOS);

    //Load WebOS images
    //webos_image* image_WebOS_wallpaper = new webos_image("images/wallpaper.png");
    //images.push_back(image_WebOS_wallpaper);
}

//-----------------------------------------------------------------------------
// [SECTION] Style functions
//-----------------------------------------------------------------------------

void ImGui::StyleColorsIoTeX(ImGuiStyle* dst)
{
    ImGuiStyle* style = dst ? dst : &ImGui::GetStyle();
    ImVec4* colors = style->Colors;
    colors[ImGuiCol_Text]                   = ImVec4(1.00f, 1.00f, 1.00f, 1.00f);
    colors[ImGuiCol_TextDisabled]           = ImVec4(0.35f, 0.44f, 0.27f, 1.00f);
    colors[ImGuiCol_WindowBg]               = ImVec4(0.00f, 0.00f, 0.00f, 0.54f);
    colors[ImGuiCol_ChildBg]                = ImVec4(0.00f, 0.00f, 0.00f, 0.00f);
    colors[ImGuiCol_PopupBg]                = ImVec4(0.08f, 0.08f, 0.08f, 0.94f);
    colors[ImGuiCol_Border]                 = ImVec4(0.00f, 0.86f, 0.61f, 1.00f);
    colors[ImGuiCol_BorderShadow]           = ImVec4(0.06f, 0.94f, 0.53f, 0.56f);
    colors[ImGuiCol_FrameBg]                = ImVec4(0.15f, 0.15f, 0.15f, 0.56f);
    colors[ImGuiCol_FrameBgHovered]         = ImVec4(0.00f, 0.86f, 0.61f, 0.23f);
    colors[ImGuiCol_FrameBgActive]          = ImVec4(0.33f, 0.53f, 0.34f, 0.00f);
    colors[ImGuiCol_TitleBg]                = ImVec4(0.00f, 0.00f, 0.00f, 1.00f);
    colors[ImGuiCol_TitleBgActive]          = ImVec4(1.00f, 0.74f, 0.00f, 1.00f);
    colors[ImGuiCol_TitleBgCollapsed]       = ImVec4(0.12f, 0.82f, 0.49f, 1.00f);
    colors[ImGuiCol_MenuBarBg]              = ImVec4(0.02f, 0.02f, 0.02f, 1.00f);
    colors[ImGuiCol_ScrollbarBg]            = ImVec4(0.00f, 0.00f, 0.00f, 0.00f);
    colors[ImGuiCol_ScrollbarGrab]          = ImVec4(0.18f, 0.18f, 0.18f, 1.00f);
    colors[ImGuiCol_ScrollbarGrabHovered]   = ImVec4(0.12f, 0.82f, 0.49f, 1.00f);
    colors[ImGuiCol_ScrollbarGrabActive]    = ImVec4(1.00f, 0.74f, 0.00f, 1.00f);
    colors[ImGuiCol_CheckMark]              = ImVec4(1.00f, 0.74f, 0.00f, 1.00f);
    colors[ImGuiCol_SliderGrab]             = ImVec4(0.12f, 0.82f, 0.49f, 1.00f);
    colors[ImGuiCol_SliderGrabActive]       = ImVec4(1.00f, 0.74f, 0.00f, 1.00f);
    colors[ImGuiCol_Button]                 = ImVec4(0.00f, 0.00f, 0.00f, 1.00f);
    colors[ImGuiCol_ButtonHovered]          = ImVec4(0.12f, 0.82f, 0.49f, 1.00f);
    colors[ImGuiCol_ButtonActive]           = ImVec4(1.00f, 0.74f, 0.00f, 1.00f);
    colors[ImGuiCol_Header]                 = ImVec4(0.00f, 0.00f, 0.00f, 0.67f);
    colors[ImGuiCol_HeaderHovered]          = ImVec4(0.12f, 0.82f, 0.49f, 1.00f);
    colors[ImGuiCol_HeaderActive]           = ImVec4(1.00f, 0.74f, 0.00f, 1.00f);
    colors[ImGuiCol_Separator]              = ImVec4(0.35f, 0.44f, 0.27f, 1.00f);
    colors[ImGuiCol_SeparatorHovered]       = ImVec4(0.18f, 0.23f, 0.20f, 1.00f);
    colors[ImGuiCol_SeparatorActive]        = ImVec4(1.00f, 0.74f, 0.00f, 1.00f);
    colors[ImGuiCol_ResizeGrip]             = ImVec4(0.12f, 0.82f, 0.49f, 1.00f);
    colors[ImGuiCol_ResizeGripHovered]      = ImVec4(0.12f, 0.82f, 0.49f, 1.00f);
    colors[ImGuiCol_ResizeGripActive]       = ImVec4(1.00f, 0.74f, 0.00f, 1.00f);
    colors[ImGuiCol_Tab]                    = ImVec4(1.00f, 0.74f, 0.00f, 0.12f);
    colors[ImGuiCol_TabHovered]             = ImVec4(0.12f, 0.82f, 0.49f, 1.00f);
    colors[ImGuiCol_TabActive]              = ImVec4(0.00f, 0.00f, 0.00f, 1.00f);
    colors[ImGuiCol_TabUnfocused]           = ImVec4(0.00f, 0.00f, 0.00f, 0.97f);
    colors[ImGuiCol_TabUnfocusedActive]     = ImVec4(0.01f, 0.77f, 0.46f, 0.16f);
    colors[ImGuiCol_DockingPreview]         = ImVec4(0.26f, 0.59f, 0.98f, 0.22f);
    colors[ImGuiCol_DockingEmptyBg]         = ImVec4(0.20f, 0.20f, 0.20f, 1.00f);
    colors[ImGuiCol_PlotLines]              = ImVec4(0.61f, 0.61f, 0.61f, 1.00f);
    colors[ImGuiCol_PlotLinesHovered]       = ImVec4(1.00f, 0.43f, 0.35f, 1.00f);
    colors[ImGuiCol_PlotHistogram]          = ImVec4(0.90f, 0.70f, 0.00f, 1.00f);
    colors[ImGuiCol_PlotHistogramHovered]   = ImVec4(1.00f, 0.60f, 0.00f, 1.00f);
    colors[ImGuiCol_TableHeaderBg]          = ImVec4(0.78f, 0.87f, 0.98f, 1.00f);
    colors[ImGuiCol_TableBorderStrong]      = ImVec4(0.57f, 0.57f, 0.64f, 1.00f);
    colors[ImGuiCol_TableBorderLight]       = ImVec4(0.68f, 0.68f, 0.74f, 1.00f);
    colors[ImGuiCol_TableRowBg]             = ImVec4(0.00f, 0.00f, 0.00f, 0.00f);
    colors[ImGuiCol_TableRowBgAlt]          = ImVec4(0.30f, 0.30f, 0.30f, 0.09f);
    colors[ImGuiCol_TextSelectedBg]         = ImVec4(0.26f, 0.59f, 0.98f, 0.35f);
    colors[ImGuiCol_DragDropTarget]         = ImVec4(1.00f, 1.00f, 0.00f, 0.90f);
    colors[ImGuiCol_NavHighlight]           = ImVec4(0.26f, 0.59f, 0.98f, 1.00f);
    colors[ImGuiCol_NavWindowingHighlight]  = ImVec4(1.00f, 1.00f, 1.00f, 0.70f);
    colors[ImGuiCol_NavWindowingDimBg]      = ImVec4(0.80f, 0.80f, 0.80f, 0.20f);
    colors[ImGuiCol_ModalWindowDimBg]       = ImVec4(0.80f, 0.80f, 0.80f, 0.35f);
}

void WebOS::setStyle() {

	//Set all ImGui styles
    ImGuiIO& io = ImGui::GetIO(); (void)io;
    io.ConfigFlags |= ImGuiConfigFlags_DockingEnable;
    ImFont* font = io.Fonts->AddFontFromFileTTF("fonts/DroidSans.ttf", 17.0f, nullptr, io.Fonts->GetGlyphRangesCyrillic());
    io.Fonts->Build();
    
    //font->AddRemapChar(0xF9, 0142);
    ImGui::StyleColorsIoTeX();
	this->style.WindowPadding = this->imGuiStylePtr->WindowPadding				= ImVec2(4, 7);
	this->style.FramePadding = this->imGuiStylePtr->FramePadding				= ImVec2(6, 6);
	this->style.ItemSpacing = this->imGuiStylePtr->ItemSpacing				    = ImVec2(20, 20);
	this->style.ItemInnerSpacing = this->imGuiStylePtr->ItemInnerSpacing		= ImVec2(14, 20);
	this->style.TouchExtraPadding = this->imGuiStylePtr->TouchExtraPadding		= ImVec2(5, 5);
	this->style.IndentSpacing = this->imGuiStylePtr->IndentSpacing				= (float)21;
	this->style.FrameRounding = this->imGuiStylePtr->FrameRounding				= (float)3;
	this->style.ScrollbarSize = this->imGuiStylePtr->ScrollbarSize				= (float)20;
	this->style.GrabMinSize = this->imGuiStylePtr->GrabMinSize				    = (float)10;
	this->style.WindowBorderSize = this->imGuiStylePtr->WindowBorderSize		= (float)1;
	this->style.ChildBorderSize =  this->imGuiStylePtr->ChildBorderSize			= (float)1;
	this->style.PopupBorderSize = this->imGuiStylePtr->PopupBorderSize			= (float)1;
	this->style.FrameBorderSize = this->imGuiStylePtr->FrameBorderSize			= (float)1;
	this->style.TabBorderSize = this->imGuiStylePtr->TabBorderSize				= (float)1;
	this->style.WindowRounding= this->imGuiStylePtr->WindowRounding				= (float)6;
	this->style.ChildRounding = this->imGuiStylePtr->ChildRounding				= (float)6;
	this->style.GrabRounding = this->imGuiStylePtr->GrabRounding				= (float)7;
}

//ToDo remove this from here and add to WebOS window and initiate WebConsole Class
/*
struct WebOSConsole
{
    char                  InputBuf[256];
    ImVector<char*>       Items;
    ImVector<const char*> Commands;
    char                  _return;
    ImVector<char*>       History;
    int                   HistoryPos;    // -1: new line, 0..History.Size-1 browsing history.
    ImGuiTextFilter       Filter;
    bool                  AutoScroll;
    bool                  ScrollToBottom;
    CURL                  *curl;
  	CURLcode              res;
  	ImVector<const char*> CommandParameters;
    std::string           consoleBuffer;
    std::string           requestDataBuffer;
    int                   requestDataBufferSize;
    EasyCurl              *easyCurl = new EasyCurl(&consoleBuffer);

    static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void* userp)
    {
        WebOSConsole* console = (WebOSConsole*)userp;
        console->consoleBuffer.append((char*)contents, size * nmemb);
        console->consoleBuffer.append(std::string("\n"));
        return size * nmemb;
    }

    WebOSConsole()
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
    ~WebOSConsole()
    {
        ClearLog();
        for (int i = 0; i < History.Size; i++)
            free(History[i]);
    }

    // Portable helpers
    //static int   easyCurl->Stricmp(const char* str1, const char* str2)         { int d; while ((d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; if(*str1 == ' ') {return d;} if(!*str2) {return d;}} return d; }
    static int   Strnicmp(const char* str1, const char* str2, int n) { int d = 0; while (n > 0 && (d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; n--; } return d; }
    static char* Strdup(const char *str)                             { size_t len = strlen(str) + 1; void* buf = malloc(len); IM_ASSERT(buf); return (char*)memcpy(buf, (const void*)str, len); }
    static void  Strtrim(char* str)                                  { char* str_end = str + strlen(str); while (str_end > str && str_end[-1] == ' ') str_end--; *str_end = 0;}
    static bool  isNumber(const std::string& str)                    { for (char const &c : str) { if (std::isdigit(c) == 0) return false; } return true; }
    static char* strcat(char * dst, const char * src)                { char *p = dst; while (*p){++p;}while (*p++ = *src++);return dst;}

    void    ClearLog()
    {
        consoleBuffer.clear();
    }

     #if defined(__EMSCRIPTEN__)
        static void onLoaded(emscripten_fetch_t *fetch) 
        {
            printf("Finished downloading %llu bytes from URL %s.\n", fetch->numBytes, fetch->url);

            WebOSConsole* console = (WebOSConsole*)fetch->userData;
            console->consoleBuffer.append((char*)fetch->data, fetch->totalBytes);
            console->consoleBuffer.append(std::string("\n"));
            emscripten_fetch_close(fetch);
        }
        static void onError(emscripten_fetch_t *fetch)
        {
            std::string error = std::string("[error] Connection Failed!\n") + fetch->url + " - HTTP failure status code: " + std::to_string(fetch->status) + std::string("\n");
            
            printf("Connection %s failed, HTTP failure status code: %d.\nSee browser debug console log for more details", fetch->url, fetch->status);
            
            WebOSConsole* console = (WebOSConsole*)fetch->userData;
            console->consoleBuffer.append(error);
            console->consoleBuffer.append(std::string("\n"));

            emscripten_fetch_close(fetch);
        }
    #endif

    void easycurl(const char* command_line)
    {
        easyCurl->execute_command(command_line);
    }

    void post(const char* URL, const char* command_line)
    {
        if ((URL != NULL) && (URL[0] != '\0')) {     
            if (isNumber(URL))
            {
                consoleBuffer.append("[info] Correct usage: POST [url] \n");
                return;
            }
            if ((strncmp(URL, "http://", 7) == 0) || (strncmp(URL, "https://", 8) == 0)) {   
            #if defined(__EMSCRIPTEN__)
                emscripten_fetch_attr_t attr;
                emscripten_fetch_attr_init(&attr);
                strcpy(attr.requestMethod, "POST");
                const char * headers[] = {"Content-Type", "application/json", 0};
                requestDataBuffer = "{\"";
                requestDataBuffer += command_line;
                requestDataBuffer += "\": \"test\"}";
                const char * requestData = requestDataBuffer.data();

//curl -X POST -H "Content-Type:application/json" --data '{"id": 1, "jsonrpc": "2.0", "method": "eth_getBalance", "params": ["0xE584ca6F469c11140Bb9c4617Cb8f373E38C5D46", ""]}' http://babel-api.mainnet.iotex.io:8545
                attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
                attr.onsuccess = onLoaded;
                attr.onerror = onError;
                attr.userData = (void*)this;
                attr.requestHeaders = headers;
                attr.requestData = requestData;
                attr.requestDataSize = strlen(requestData);

                emscripten_fetch(&attr, URL);
            #else
                curl = curl_easy_init();
                if(curl) {
                    curl_easy_setopt(curl, CURLOPT_URL, URL);
                    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
                    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void*)this);
                    res = curl_easy_perform(curl);
                    curl_easy_cleanup(curl);
                }  
            #endif
            }
            else {  
                    consoleBuffer.append("[info] Correct usage: POST [url] \n");
                 }
        }
        else { 
                consoleBuffer.append("[info] Correct usage: POST [url] \n");
             }
    }

    void fetch(const char* URL)
    {
        if ((URL != NULL) && (URL[0] != '\0')) {     
            if (isNumber(URL))
            {
                consoleBuffer.append("[info] Correct usage: FETCH [url] \n");
                return;
            }
            if ((strncmp(URL, "http://", 7) == 0) || (strncmp(URL, "https://", 8) == 0)) {   
            #if defined(__EMSCRIPTEN__)
                emscripten_fetch_attr_t attr;
                emscripten_fetch_attr_init(&attr);
                strcpy(attr.requestMethod, "GET");
                attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
                attr.onsuccess = onLoaded;
                attr.onerror = onError;
                attr.userData = (void*)this;

                emscripten_fetch(&attr, URL);
                //ImGui::Text("Loading %c", "|/-\\"[(int)(ImGui::GetTime() / 0.05f) & 3]);
                consoleBuffer.append("Connecting to ");
                consoleBuffer.append(URL);
                consoleBuffer.append(" using HTTPS GET request \n");
            #else
                curl = curl_easy_init();
                if(curl) {
                    curl_easy_setopt(curl, CURLOPT_URL, URL);
                    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
                    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void*)this);
                    res = curl_easy_perform(curl);
                    curl_easy_cleanup(curl);
                }  
            #endif
            }
            else { 
                    consoleBuffer.append("[info] Correct usage: FETCH [url] \n"); 
                 }
        }
        else { 
                consoleBuffer.append("[info] Correct usage: FETCH [url] \n"); 
             }
    }

    const void    Draw(const char* title, bool* p_open)
    {
        
        if (!ImGui::Begin(title, p_open))
        {
            ImGui::End();
            return;
        }

        // As a specific feature guaranteed by the library, after calling Begin() the last Item represent the title bar. So e.g. IsItemHovered() will return true when hovering the title bar.
        // Here we create a context menu only available from the title bar.
        if (ImGui::BeginPopupContextItem())
        {
            if (ImGui::MenuItem("Close"))
                *p_open = false;
            ImGui::EndPopup();
        }

        ImGui::TextWrapped("Enter 'HELP' for help, press TAB to use text completion.");

        // TODO: display items starting from the bottom
            
        if (ImGui::SmallButton("Connect ioPay Wallet"))  { 
            consoleBuffer.append("Running command: ./ioctl bc info \n");
            fetch("https://89.70.221.154/");
        } 

        ImGui::SameLine();
        if (ImGui::SmallButton("Commit Transaction")) { 
            consoleBuffer.append("[error] Wallet not connected \n");
        } ImGui::SameLine();
        if (ImGui::SmallButton("Clear")) { ClearLog(); } ImGui::SameLine();
        bool copy_to_clipboard = ImGui::SmallButton("Copy");
        //static float t = 0.0f; if (ImGui::GetTime() - t > 0.02f) { t = ImGui::GetTime(); AddLog("Spam %f", t); }


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
            //ImGui::SetScrollHereY(1.0f);
        }

        ImGui::PopStyleVar();
        ImGui::EndChild();

        bool reclaim_focus = false;
        if (ImGui::InputText("Input", InputBuf, IM_ARRAYSIZE(InputBuf), ImGuiInputTextFlags_EnterReturnsTrue|ImGuiInputTextFlags_CallbackCompletion|ImGuiInputTextFlags_CallbackHistory, &InputCommandConsoleCallbackStub, (void*)this))
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

    void    ExecCommand(const char* command_line)
    {
        //test direct console output manipulation
        consoleBuffer += "# > ";
        consoleBuffer += command_line;
        consoleBuffer += "\n";
        
        // Process command
        if (easyCurl->Stricmprlx(command_line, "CLEAR") == 0)
        {
            ClearLog();
        }
        else if (easyCurl->Stricmprlx(command_line, "HELP") == 0)
        {
            char * token = strtok((char *)command_line, " ");
            consoleBuffer.append("Commands: \n");
            for (int i = 0; i < Commands.Size; i++)
            {
                consoleBuffer.append("- ");
                consoleBuffer.append(Commands[i]);
            }
        }
        else if (easyCurl->Stricmprlx(command_line, "IOCTL") == 0)
        {
            //char * token = strtok((char *)command_line, " ");
            post("https://89.70.221.154/", command_line);

        }
        else if (easyCurl->Stricmprlx(command_line, "CURL") == 0)
        {
            char * requestData;
            char * command_line_copy = strdup(command_line);
            char * token = strtok((char *)command_line_copy, " "); //tokenize the command into parameters
            
            if((token = strtok(NULL," ")) && token) // first parameter of CURL command
            {     
                if(easyCurl->Stricmprlx(token, "http") == 0) //if it's just curl http (website request) return fetch command
                    fetch(token); 
                else {
                    easycurl(command_line); //else try to process command
                }
                //curl -X POST -H "Content-Type:application/json" --data '{"id": 1, "jsonrpc": "2.0", "method": "eth_getBalance", "params": ["0xE584ca6F469c11140Bb9c4617Cb8f373E38C5D46", ""]}' http://babel-api.mainnet.iotex.io:8545
                //      ^
                //if(easyCurl->Stricmp(command_line, "-X")
            }
            else {
                easycurl(command_line);
            }
            //char * token = strtok((char *)command_line, " ");
            //post("https://babel-api.testnet.iotex.io", token);
        }
        else if (easyCurl->Stricmprlx(command_line, "HISTORY") == 0)
        {
            int first = History.Size - 10;
            for (int i = first > 0 ? first : 0; i < History.Size; i++)
            {
                consoleBuffer.append(std::to_string(i));
                consoleBuffer.append(History[i]);
                consoleBuffer.append(" \n");
            }
        }
        else if (easyCurl->Stricmprlx(command_line, "FETCH") == 0)
        {
            char * token = strtok((char *)command_line, " ");
            token = strtok(NULL," "); //second parameter         
            fetch(token); 
        }
        else
        {
            consoleBuffer.append("[error] Unknown command: ");
            consoleBuffer.append(command_line);
            consoleBuffer.append("\n");
        }
        ScrollToBottom = true;
    }

    static int InputCommandConsoleCallbackStub(ImGuiInputTextCallbackData* data) // In C++11 you are better off using lambdas for this sort of forwarding callbacks
    {
        ImGuiWindow*          window            = ImGui::GetCurrentWindow();
        const ImGuiID         ConsoleWindowId   = window->GetID("Console");

        WebOSConsole* console = (WebOSConsole*)data->UserData; 
        //ImGui::GetInputTextState(ImGui::GetID("Console"))->SelectAll(); 
        return 0;
    }
};

void WebOS::ShowExampleAppConsole(bool* p_open)
{
    static WebOSConsole console;
    ImGui::SetNextWindowPos(ImVec2(253, 54), ImGuiCond_FirstUseEver);
    ImGui::SetNextWindowSize(ImVec2(644,421), ImGuiCond_FirstUseEver);
    console.Draw("IoTeX Console", p_open);
}
*/