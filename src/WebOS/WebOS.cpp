#include "WebOS.h"

WebOS::WebOS() {
	//WebOS_style style;
	this->imGuiStylePtr = &ImGui::GetStyle();
    loadTextureFromFile("images/io1m43dzu4q5klmhu9yffperyrugu8dag58kq9syu.png", &icon);
    loadTextureFromFile("images/wallpaper.png", &wallpaper);
    
}

void WebOS::loadTextureFromFile(const char* file, GLuint* textureID) {
    SDL_Surface* original = IMG_Load(file);
    if(!original)
    {
        printf("Error in loadTextureFromFile: %s\n", IMG_GetError());
    }
    SDL_Surface* converted = SDL_CreateRGBSurface(0, original->w, original->h, 24, 0x0000FF, 0x00FF00, 0xFF0000, 0x000000);
    if(!converted)
    {
        printf("Error in loadTextureFromFile: %s\n", IMG_GetError());
    }
    SDL_BlitSurface(original, NULL, converted, NULL);

    glGenTextures(1, textureID);
    glBindTexture(GL_TEXTURE_2D, *textureID);

    int Mode = GL_RGB;

    if (original->format->BytesPerPixel == 4) {
        Mode = GL_RGBA;
    }

    glTexImage2D(GL_TEXTURE_2D, 0, Mode, original->w, original->h, 0, Mode, GL_UNSIGNED_BYTE, original->pixels);

    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
}

void WebOS::setStyle() {

	//Set all ImGui styles
    ImGuiIO& io = ImGui::GetIO(); (void)io;
    ImFont* font = io.Fonts->AddFontFromFileTTF("fonts/DroidSans.ttf", 17.0f, nullptr, io.Fonts->GetGlyphRangesPolish());
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

	//Set background color
	//this->style.backgroundColor = ImVec4(0.56f, 0.73f, 0.84f, 1.00f);
}

ImVec4* WebOS::getBackgroundColor() {
	return &this->style.backgroundColor;
}
void WebOS::showWelcomePopup(bool* p_open)
{
    ImGui::SetNextWindowSize(ImVec2(365, 210), ImGuiCond_FirstUseEver);
    ImGui::SetNextWindowPos(ImVec2(ImGui::GetIO().DisplaySize.x/2-200, ImGui::GetIO().DisplaySize.y/2-100), ImGuiCond_FirstUseEver);
    if(!ImGui::Begin("Welcome to IoTeX console", p_open))
    {
        ImGui::End();
    }else
    {
        /*void ImGui::RenderBullet(ImDrawList* draw_list, ImVec2 pos, ImU32 col)
        {
            draw_list->AddCircleFilled(pos, draw_list->_Data->FontSize * 0.20f, col, 8);
        }*/
        //ImGui::GetBackgroundDrawList()->PushTextureID(&wallpaper);
        ImGui::Image((void*)(intptr_t)wallpaper, ImVec2(365, 210));
        //ImGui::GetBackgroundDrawList()->AddRect(ImVec2((ImGui::GetWindowContentRegionMin().x + ImGui::GetWindowPos().x),(ImGui::GetWindowContentRegionMin().y + ImGui::GetWindowPos().y)), ImVec2((ImGui::GetWindowContentRegionMax().x + ImGui::GetWindowPos().x),(ImGui::GetWindowContentRegionMax().y + ImGui::GetWindowPos().y)), IM_COL32(255,255,255,255));
        //ImGui::RenderTextClipped(ImVec2((ImGui::GetWindowContentRegionMin().x + ImGui::GetWindowPos().x),(ImGui::GetWindowContentRegionMin().y + ImGui::GetWindowPos().y)), ImVec2((ImGui::GetWindowContentRegionMax().x + ImGui::GetWindowPos().x),(ImGui::GetWindowContentRegionMax().y + ImGui::GetWindowPos().y)), "text", NULL, NULL, ImVec2(0.5f,0.0f));
        //ImGui::Text("Loading %c", "|/-\\"[(int)(ImGui::GetTime() / 0.05f) & 3]);
        //ImGui::GetWindowDrawList()->AddCircleFilled(ImVec2((ImGui::GetWindowContentRegionMin().x + ImGui::GetWindowPos().x + 2),(ImGui::GetWindowContentRegionMin().y + ImGui::GetWindowPos().y +5)), 2, IM_COL32(255,255,255,255), 8);
        //ImGui::GetWindowDrawList()->BulletText();
        ImGui::GetWindowDrawList()->AddText(ImVec2((ImGui::GetWindowContentRegionMin().x + ImGui::GetWindowPos().x + 10),(ImGui::GetWindowContentRegionMin().y + ImGui::GetWindowPos().y)), IM_COL32(255,255,255,255), "testing");
        ImGui::TextWrapped("Please use the right mouse click to open Menu");
        ImGui::TextWrapped("Click the JRPC token icon to open command console");
        ImGui::Separator();
        ImGui::TextWrapped("Application average %.3f ms/frame (%.1f FPS)",
                    1000.0f / ImGui::GetIO().Framerate,
                    ImGui::GetIO().Framerate);
        ImGui::PushStyleColor(ImGuiCol_Text, ImVec4(1.0f, 0.4f, 0.4f, 1.0f)); ImGui::TextWrapped("This website is still under development!!"); ImGui::PopStyleColor();
        ImGui::End();
    }
}
    

    // As a specific feature guaranteed by the library, after calling Begin() the last Item represent the title bar. So e.g. IsItemHovered() will return true when hovering the title bar.
    // Here we create a context menu only available from the title bar.
    
    /*
    ImVec2 welcomePopupLocation = ImVec2(520,600);
    ImGui::SetNextWindowSize(welcomePopupLocation, ImGuiCond_FirstUseEver);
    ImGui::SetNextWindowPos(ImVec2(ImGui::GetIO().DisplaySize.x-welcomePopupLocation.x, ImGui::GetIO().DisplaySize.y-welcomePopupLocation.y), ImGuiCond_FirstUseEver);
    */

void WebOS::showIcon()
{
    if(show_test_window)
    {
        ShowExampleAppConsole(&show_test_window);
        /*ImGui::SetNextWindowPos(ImVec2(100, 100), ImGuiCond_FirstUseEver);
        ImGui::Begin("Same title as another window##1");
        ImGui::Text("This is window 1.\nMy title is the same as window 2, but my identifier is unique.");
        ImGui::End();*/
    }
    ImVec2 iconSize = ImVec2(32.0f/32, 32.0f/32);
    ImGui::SetNextWindowPos(ImVec2(ImGui::GetIO().DisplaySize.x/69, ImGui::GetIO().DisplaySize.y/2));
    ImGui::Begin("JRPC_Icon", NULL, ImGuiWindowFlags_NoNav | ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoBackground);
        if (ImGui::ImageButton((void*)(intptr_t)icon, ImVec2(32,32), ImVec2(0,0), iconSize, 3, ImVec4(0.0f,0.0f,0.0f,0.0f)))
        {
            if(show_test_window)
            {
                show_test_window = false;
            }
            else {
                show_test_window = true;
            }
            
            printf("JRPC icon clicked \n");
        }
    ImGui::End();
    //Show Background window
    /*
    //ImGui::SetNextWindowPos(ImVec2(10, 10));
    ImGui::SetNextWindowSize(iconSize);
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(0, 0));
    ImGui::PushStyleVar(ImGuiStyleVar_WindowBorderSize, 2);
    ImGui::Begin("Icon1", NULL, ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoNav);
    ImGui::Image((void*)(intptr_t)icon, iconSize);
    ImGui::End();
    ImGui::PopStyleVar();
    ImGui::PopStyleVar();
    */
    if(show_welcome_popup)
    {
        showWelcomePopup(&show_welcome_popup);
    }
}

void WebOS::showBackgroundWallpaper()
{
    //Show Background window
    ImGui::SetNextWindowPos(ImVec2(0, 0));
    ImGui::SetNextWindowSize(ImGui::GetIO().DisplaySize);
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(0, 0));
    ImGui::PushStyleVar(ImGuiStyleVar_WindowBorderSize, 0);
    ImGui::Begin("myWallpaper", NULL, ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoInputs | ImGuiWindowFlags_NoNav);
    ImGui::Image((void*)(intptr_t)wallpaper, ImGui::GetIO().DisplaySize);
    ImGui::End();
    ImGui::PopStyleVar();
    ImGui::PopStyleVar();
}

void WebOS::showRightClickContextMenu()
{
    if (ImGui::BeginPopup("ContextMenu"))
    {
        ImGui::Button("Test");
        ImGui::EndPopup();
    }
}

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
  	std::string           readBuffer;
    std::string           consoleBuffer;

    //bool                  printed;

    /*int64_t               secret;
    int64_t               sharedEncryptionKey;
    int64_t               sharedDecryptionKey;
    int64_t               secretKey;
    int64_t               public_prime_base;
    int64_t               public_prime_modulus;*/

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
        Commands.push_back("HELP");
        Commands.push_back("HISTORY");
        Commands.push_back("CLEAR");
        Commands.push_back("CLASSIFY");  // "classify" is only here to provide an example of "C"+[tab] completing to "CL" and displaying matches.
        Commands.push_back("FETCH [url]");
        /*Commands.push_back("IOCTL");
        Commands.push_back("SECRET - do not use");
        Commands.push_back("ENCRYPT - do not use");
        Commands.push_back("DECRYPT - do not use");*/
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
    static int   Stricmp(const char* str1, const char* str2)         { int d; while ((d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; } return d; }
    static int   Strnicmp(const char* str1, const char* str2, int n) { int d = 0; while (n > 0 && (d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; n--; } return d; }
    static char* Strdup(const char *str)                             { size_t len = strlen(str) + 1; void* buf = malloc(len); IM_ASSERT(buf); return (char*)memcpy(buf, (const void*)str, len); }
    static void  Strtrim(char* str)                                  { char* str_end = str + strlen(str); while (str_end > str && str_end[-1] == ' ') str_end--; *str_end = 0;}
    bool         isNumber(const std::string& str)                    { for (char const &c : str) { if (std::isdigit(c) == 0) return false; } return true; }
    
    //modulo privte key encryption test
    //int64_t      generateSecretKey(int64_t secretInput)                   { return secret = secretInput; }
    //int64_t      encrypt(int64_t public_prime_base, int64_t public_prime_modulus)        { sharedEncryptionKey = (int64_t)std::pow(public_prime_base, secret) % public_prime_modulus; return sharedEncryptionKey;}
    //int64_t      decrypt(int64_t sharedDecryptionKey)                { secretKey = (int64_t)std::pow(sharedDecryptionKey, secret) % public_prime_modulus; return secretKey;}

    void    ClearLog()
    {
        consoleBuffer.clear();
    }

    //To Do - write an AddLog function which takes in a string and outputs to consoleBuffer with newline char appended to it
    /*const void    AddLog(const char* fmt, ...) IM_FMTARGS(2)
    {
        // FIXME-OPT
        char buf[32000];
        va_list args;
        va_start(args, fmt);
        vsnprintf(buf, sizeof(buf), fmt, args);
        buf[sizeof(buf)-1] = 0;
        va_end(args);
        Items.push_back(Strdup(buf));
    }*/

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
                const char * command = "{\"id\": 1, \"jsonrpc\": \"2.0\", \"method\": \"eth_getBalance\", \"params\": [\"0xE584ca6F469c11140Bb9c4617Cb8f373E38C5D46\", \"\"]}";
                //const char * command = "{\"ioctl\": \"command\"}";           
//curl -X POST -H "Content-Type:application/json" --data '{"id": 1, "jsonrpc": "2.0", "method": "eth_getBalance", "params": ["0xE584ca6F469c11140Bb9c4617Cb8f373E38C5D46", ""]}' http://babel-api.mainnet.iotex.io:8545
                attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
                attr.onsuccess = onLoaded;
                attr.onerror = onError;
                attr.userData = (void*)this;
                attr.requestHeaders = headers;
                attr.requestData = command;
                attr.requestDataSize = strlen(attr.requestData);

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
                    //std::cout << readBuffer << std::endl;
                    
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

        if (ScrollToBottom || (AutoScroll && ImGui::GetScrollY() >= ImGui::GetScrollMaxY()))
        {
            ImGui::SetScrollHereY(1.0f);
            ScrollToBottom = false;
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
        
        char * token = strtok((char *)command_line, " ");

        // Process command
        if (Stricmp(command_line, "CLEAR") == 0)
        {
            ClearLog();
        }
        else if (Stricmp(command_line, "HELP") == 0)
        {
            consoleBuffer.append("Commands: \n");
            for (int i = 0; i < Commands.Size; i++)
            {
                consoleBuffer.append("- ");
                consoleBuffer.append(Commands[i]);
            }
        }
    
        else if (Stricmp(command_line, "CURL") == 0)
        {
            post("https://babel-api.testnet.iotex.io", command_line);
        }
        else if (Stricmp(command_line, "HISTORY") == 0)
        {
            int first = History.Size - 10;
            for (int i = first > 0 ? first : 0; i < History.Size; i++)
            {
                consoleBuffer.append(std::to_string(i));
                consoleBuffer.append(History[i]);
                consoleBuffer.append(" \n");
            }
        }
        else if (Stricmp(token, "FETCH") == 0)
        {
            token = strtok(NULL," ");          
            fetch(token); 
        }
        else
        {
            consoleBuffer.append("[error] Unknown command: ");
            consoleBuffer.append(command_line);
            consoleBuffer.append("\n");
        }
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
    ImGui::SetNextWindowPos(ImVec2(534, 73), ImGuiCond_FirstUseEver);
    ImGui::SetNextWindowSize(ImVec2(520,600), ImGuiCond_FirstUseEver);
    console.Draw("IoTeX Console", p_open);
}