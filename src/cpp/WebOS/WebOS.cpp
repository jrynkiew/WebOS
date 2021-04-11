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
    ImFont* font = io.Fonts->AddFontFromFileTTF("fonts/DroidSans.ttf", 17.0f, nullptr, io.Fonts->GetGlyphRangesCyrillic());
    io.Fonts->Build();
    //font->AddRemapChar(0xF9, 0142);
    ImGui::StyleColorsIoTeX();
	this->style.WindowPadding = this->imGuiStylePtr->WindowPadding				= ImVec2(4, 7);
	this->style.FramePadding = this->imGuiStylePtr->FramePadding				= ImVec2(6, 6);
	this->style.ItemSpacing = this->imGuiStylePtr->ItemSpacing				= ImVec2(20, 20);
	this->style.ItemInnerSpacing = this->imGuiStylePtr->ItemInnerSpacing			= ImVec2(14, 20);
	this->style.TouchExtraPadding = this->imGuiStylePtr->TouchExtraPadding			= ImVec2(5, 5);
	this->style.IndentSpacing = this->imGuiStylePtr->IndentSpacing				= (float)21;
	this->style.FrameRounding = this->imGuiStylePtr->FrameRounding				= (float)3;
	this->style.ScrollbarSize = this->imGuiStylePtr->ScrollbarSize				= (float)20;
	this->style.GrabMinSize = this->imGuiStylePtr->GrabMinSize				= (float)10;
	this->style.WindowBorderSize = this->imGuiStylePtr->WindowBorderSize			= (float)1;
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
    ImGui::SetNextWindowSize(ImVec2(46, 46));
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
            
            printf("icon clicked");
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

/*
void WebOS::ShowHookMenu()
{
    if (ImGui::BeginMainMenuBar())
    {
        if (ImGui::BeginMenu("File"))
        {
            WebOS::ShowMenuFile();
            ImGui::EndMenu();
        }
        if (ImGui::BeginMenu("Edit"))
        {
            if (ImGui::MenuItem("Undo", "CTRL+Z")) {}
            if (ImGui::MenuItem("Redo", "CTRL+Y", false, false)) {}  // Disabled item
            ImGui::Separator();
            if (ImGui::MenuItem("Cut", "CTRL+X")) {}
            if (ImGui::MenuItem("Copy", "CTRL+C")) {}
            if (ImGui::MenuItem("Paste", "CTRL+V")) {}
            ImGui::EndMenu();
        }
        ImGui::EndMainMenuBar();
    }
}

void WebOS::ShowMenuFile()
{
    ImGui::MenuItem("(dummy menu)", NULL, false, false);
    if (ImGui::MenuItem("New")) {}
    if (ImGui::MenuItem("Open", "Ctrl+O")) {}
    if (ImGui::BeginMenu("Open Recent"))
    {
        ImGui::MenuItem("fish_hat.c");
        ImGui::MenuItem("fish_hat.inl");
        ImGui::MenuItem("fish_hat.h");
        if (ImGui::BeginMenu("More.."))
        {
            ImGui::MenuItem("Hello");
            ImGui::MenuItem("Sailor");
            if (ImGui::BeginMenu("Recurse.."))
            {
                ShowMenuFile();
                ImGui::EndMenu();
            }
            ImGui::EndMenu();
        }
        ImGui::EndMenu();
    }
    if (ImGui::MenuItem("Save", "Ctrl+S")) {}
    if (ImGui::MenuItem("Save As..")) {}

    ImGui::Separator();
    if (ImGui::BeginMenu("Options"))
    {
        static bool enabled = true;
        ImGui::MenuItem("Enabled", "", &enabled);
        ImGui::BeginChild("child", ImVec2(0, 60), true);
        for (int i = 0; i < 10; i++)
            ImGui::Text("Scrolling Text %d", i);
        ImGui::EndChild();
        static float f = 0.5f;
        static int n = 0;
        ImGui::SliderFloat("Value", &f, 0.0f, 1.0f);
        ImGui::InputFloat("Input", &f, 0.1f);
        ImGui::Combo("Combo", &n, "Yes\0No\0Maybe\0\0");
        ImGui::EndMenu();
    }

    if (ImGui::BeginMenu("Colors"))
    {
        float sz = ImGui::GetTextLineHeight();
        for (int i = 0; i < ImGuiCol_COUNT; i++)
        {
            const char* name = ImGui::GetStyleColorName((ImGuiCol)i);
            ImVec2 p = ImGui::GetCursorScreenPos();
            ImGui::GetWindowDrawList()->AddRectFilled(p, ImVec2(p.x + sz, p.y + sz), ImGui::GetColorU32((ImGuiCol)i));
            ImGui::Dummy(ImVec2(sz, sz));
            ImGui::SameLine();
            ImGui::MenuItem(name);
        }
        ImGui::EndMenu();
    }

    // Here we demonstrate appending again to the "Options" menu (which we already created above)
    // Of course in this demo it is a little bit silly that this function calls BeginMenu("Options") twice.
    // In a real code-base using it would make senses to use this feature from very different code locations.
    if (ImGui::BeginMenu("Options")) // <-- Append!
    {
        static bool b = true;
        ImGui::Checkbox("SomeOption", &b);
        ImGui::EndMenu();
    }

    if (ImGui::BeginMenu("Disabled", false)) // Disabled
    {
        IM_ASSERT(0);
    }
    if (ImGui::MenuItem("Checked", NULL, true)) {}
    if (ImGui::MenuItem("Quit", "Alt+F4")) {}
}*/

struct ExampleAppConsole
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
    CURL *curl;
  	CURLcode res;
  	std::string readBuffer;

    static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp)
    {
        ((std::string*)userp)->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

    ExampleAppConsole()
    {
        ClearLog();
        memset(InputBuf, 0, sizeof(InputBuf));
        HistoryPos = -1;
        Commands.push_back("HELP");
        Commands.push_back("HISTORY");
        Commands.push_back("CLEAR");
        Commands.push_back("CLASSIFY");  // "classify" is only here to provide an example of "C"+[tab] completing to "CL" and displaying matches.
        AutoScroll = true;
        ScrollToBottom = false;
        AddLog("Welcome to Dear ImGui!");
    }
    ~ExampleAppConsole()
    {
        ClearLog();
        for (int i = 0; i < History.Size; i++)
            free(History[i]);
    }

    // Portable helpers
    static int   Stricmp(const char* str1, const char* str2)         { int d; while ((d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; } return d; }
    static int   Strnicmp(const char* str1, const char* str2, int n) { int d = 0; while (n > 0 && (d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; n--; } return d; }
    static char* Strdup(const char *str)                             { size_t len = strlen(str) + 1; void* buf = malloc(len); IM_ASSERT(buf); return (char*)memcpy(buf, (const void*)str, len); }
    static void  Strtrim(char* str)                                  { char* str_end = str + strlen(str); while (str_end > str && str_end[-1] == ' ') str_end--; *str_end = 0; }
    
    void    ClearLog()
    {
        for (int i = 0; i < Items.Size; i++)
            free(Items[i]);
        Items.clear();
    }

    const void    AddLog(const char* fmt, ...) IM_FMTARGS(2)
    {
        // FIXME-OPT
        char buf[1024];
        va_list args;
        va_start(args, fmt);
        vsnprintf(buf, IM_ARRAYSIZE(buf), fmt, args);
        buf[IM_ARRAYSIZE(buf)-1] = 0;
        va_end(args);
        Items.push_back(Strdup(buf));
    }

     #if defined(__EMSCRIPTEN__)
        static void onLoaded(emscripten_fetch_t *fetch) 
        {
            printf("Finished downloading %llu bytes from URL %s.\n", fetch->numBytes, fetch->url);
            ((std::string*)(fetch->userData))->append((char*)fetch->data, fetch->totalBytes * fetch->numBytes);
            emscripten_fetch_close(fetch);
        }
        static void onError(emscripten_fetch_t *fetch)
        {
            printf("Connecting to ioPay %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
            ((std::string*)(fetch->userData))->append((char*)fetch->data, fetch->totalBytes * fetch->numBytes);
            emscripten_fetch_close(fetch);
        }
    #endif

    const void    Draw(const char* title, bool* p_open)
    {
        ImGui::SetNextWindowSize(ImVec2(520,600), ImGuiCond_FirstUseEver);
        if (!ImGui::Begin(title, p_open))
        {
            ImGui::End();
            return;
        }

        // As a specific feature guaranteed by the library, after calling Begin() the last Item represent the title bar. So e.g. IsItemHovered() will return true when hovering the title bar.
        // Here we create a context menu only available from the title bar.
        if (ImGui::BeginPopupContextItem())
        {
            if (ImGui::MenuItem("Close Console"))
                *p_open = false;
            ImGui::EndPopup();
        }

        ImGui::TextWrapped("Enter 'HELP' for help, press TAB to use text completion.");

        // TODO: display items starting from the bottom
            
        if (ImGui::SmallButton("Connect ioPay Wallet"))  { 
           #if defined(__EMSCRIPTEN__)
                emscripten_fetch_attr_t attr;
                emscripten_fetch_attr_init(&attr);
                strcpy(attr.requestMethod, "GET");
                attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
                attr.onsuccess = onLoaded;
                attr.onerror = onError;
                attr.userData = &readBuffer;
                emscripten_fetch(&attr, "http://localhost");
                AddLog("Wallet Connection in progress....");
                AddLog(readBuffer.c_str());

            #else
                curl = curl_easy_init();
                if(curl) {
                    curl_easy_setopt(curl, CURLOPT_URL, "https://jrpc.pl/");
                    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
                    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
                    res = curl_easy_perform(curl);
                    curl_easy_cleanup(curl);

                    //std::cout << readBuffer << std::endl;
                    AddLog(readBuffer.c_str());
                }   
            #endif
        } ImGui::SameLine();
        if (ImGui::SmallButton("Commit Transaction")) { AddLog("[error] Wallet not connected"); } ImGui::SameLine();
        if (ImGui::SmallButton("Clear")) { ClearLog(); } ImGui::SameLine();
        bool copy_to_clipboard = ImGui::SmallButton("Copy");
        //static float t = 0.0f; if (ImGui::GetTime() - t > 0.02f) { t = ImGui::GetTime(); AddLog("Spam %f", t); }

        ImGui::Separator();

        // Options menu
        if (ImGui::BeginPopup("Options"))
        {
            ImGui::Checkbox("Auto-scroll", &AutoScroll);
            ImGui::EndPopup();
        }

        // Options, Filter
        if (ImGui::Button("Options"))
            ImGui::OpenPopup("Options");
        ImGui::SameLine();
        Filter.Draw("Filter (\"incl,-excl\") (\"error\")", 180);
        ImGui::Separator();

        const float footer_height_to_reserve = ImGui::GetStyle().ItemSpacing.y + ImGui::GetFrameHeightWithSpacing(); // 1 separator, 1 input text
        ImGui::BeginChild("ScrollingRegion", ImVec2(0, -footer_height_to_reserve), false, ImGuiWindowFlags_HorizontalScrollbar); // Leave room for 1 separator + 1 InputText
        if (ImGui::BeginPopupContextWindow())
        {
            if (ImGui::Selectable("Clear")) ClearLog();
            ImGui::EndPopup();
        }

        // Display every line as a separate entry so we can change their color or add custom widgets. If you only want raw text you can use ImGui::TextUnformatted(log.begin(), log.end());
        // NB- if you have thousands of entries this approach may be too inefficient and may require user-side clipping to only process visible items.
        // You can seek and display only the lines that are visible using the ImGuiListClipper helper, if your elements are evenly spaced and you have cheap random access to the elements.
        // To use the clipper we could replace the 'for (int i = 0; i < Items.Size; i++)' loop with:
        //     ImGuiListClipper clipper(Items.Size);
        //     while (clipper.Step())
        //         for (int i = clipper.DisplayStart; i < clipper.DisplayEnd; i++)
        // However, note that you can not use this code as is if a filter is active because it breaks the 'cheap random-access' property. We would need random-access on the post-filtered list.
        // A typical application wanting coarse clipping and filtering may want to pre-compute an array of indices that passed the filtering test, recomputing this array when user changes the filter,
        // and appending newly elements as they are inserted. This is left as a task to the user until we can manage to improve this example code!
        // If your items are of variable size you may want to implement code similar to what ImGuiListClipper does. Or split your data into fixed height items to allow random-seeking into your list.
        ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(4,1)); // Tighten spacing
        if (copy_to_clipboard)
            ImGui::LogToClipboard();
        for (int i = 0; i < Items.Size; i++)
        {
            const char* item = Items[i];
            if (!Filter.PassFilter(item))
                continue;

            // Normally you would store more information in your item (e.g. make Items[] an array of structure, store color/type etc.)
            bool pop_color = false;
            if (strstr(item, "[error]"))            { ImGui::PushStyleColor(ImGuiCol_Text, ImVec4(1.0f, 0.4f, 0.4f, 1.0f)); pop_color = true; }
            else if (strncmp(item, "# ", 2) == 0)   { ImGui::PushStyleColor(ImGuiCol_Text, ImVec4(1.0f, 0.8f, 0.6f, 1.0f)); pop_color = true; }
            ImGui::TextUnformatted(item);
            if (pop_color)
                ImGui::PopStyleColor();
        }
        if (copy_to_clipboard)
            ImGui::LogFinish();

        if (ScrollToBottom || (AutoScroll && ImGui::GetScrollY() >= ImGui::GetScrollMaxY()))
            ImGui::SetScrollHereY(1.0f);
        ScrollToBottom = false;

        ImGui::PopStyleVar();
        ImGui::EndChild();
        ImGui::Separator();

        // Command-line
        bool reclaim_focus = false;
        if (ImGui::InputText("Input", InputBuf, IM_ARRAYSIZE(InputBuf), ImGuiInputTextFlags_EnterReturnsTrue|ImGuiInputTextFlags_CallbackCompletion|ImGuiInputTextFlags_CallbackHistory, &TextEditCallbackStub, (void*)this))
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
        AddLog("# %s\n", command_line);

        // Insert into history. First find match and delete it so it can be pushed to the back. This isn't trying to be smart or optimal.
        HistoryPos = -1;
        for (int i = History.Size-1; i >= 0; i--)
            if (Stricmp(History[i], command_line) == 0)
            {
                free(History[i]);
                History.erase(History.begin() + i);
                break;
            }
        History.push_back(Strdup(command_line));

        // Process command
        if (Stricmp(command_line, "CLEAR") == 0)
        {
            ClearLog();
        }
        else if (Stricmp(command_line, "HELP") == 0)
        {
            AddLog("Commands:");
            for (int i = 0; i < Commands.Size; i++)
                AddLog("- %s", Commands[i]);
        }
        else if (Stricmp(command_line, "HISTORY") == 0)
        {
            int first = History.Size - 10;
            for (int i = first > 0 ? first : 0; i < History.Size; i++)
                AddLog("%3d: %s\n", i, History[i]);
        }
        else
        {
            AddLog("Unknown command: '%s'\n", command_line);
        }

        // On commad input, we scroll to bottom even if AutoScroll==false
        ScrollToBottom = true;
    }

    static int TextEditCallbackStub(ImGuiInputTextCallbackData* data) // In C++11 you are better off using lambdas for this sort of forwarding callbacks
    {
        ExampleAppConsole* console = (ExampleAppConsole*)data->UserData;
        return console->TextEditCallback(data);
    }

    int     TextEditCallback(ImGuiInputTextCallbackData* data)
    {
        //AddLog("cursor: %d, selection: %d-%d", data->CursorPos, data->SelectionStart, data->SelectionEnd);
        switch (data->EventFlag)
        {
        case ImGuiInputTextFlags_CallbackCompletion:
            {
                // Example of TEXT COMPLETION

                // Locate beginning of current word
                const char* word_end = data->Buf + data->CursorPos;
                const char* word_start = word_end;
                while (word_start > data->Buf)
                {
                    const char c = word_start[-1];
                    if (c == ' ' || c == '\t' || c == ',' || c == ';')
                        break;
                    word_start--;
                }

                // Build a list of candidates
                ImVector<const char*> candidates;
                for (int i = 0; i < Commands.Size; i++)
                    if (Strnicmp(Commands[i], word_start, (int)(word_end-word_start)) == 0)
                        candidates.push_back(Commands[i]);

                if (candidates.Size == 0)
                {
                    // No match
                    AddLog("No match for \"%.*s\"!\n", (int)(word_end-word_start), word_start);
                }
                else if (candidates.Size == 1)
                {
                    // Single match. Delete the beginning of the word and replace it entirely so we've got nice casing
                    data->DeleteChars((int)(word_start-data->Buf), (int)(word_end-word_start));
                    data->InsertChars(data->CursorPos, candidates[0]);
                    data->InsertChars(data->CursorPos, " ");
                }
                else
                {
                    // Multiple matches. Complete as much as we can, so inputing "C" will complete to "CL" and display "CLEAR" and "CLASSIFY"
                    int match_len = (int)(word_end - word_start);
                    for (;;)
                    {
                        int c = 0;
                        bool all_candidates_matches = true;
                        for (int i = 0; i < candidates.Size && all_candidates_matches; i++)
                            if (i == 0)
                                c = toupper(candidates[i][match_len]);
                            else if (c == 0 || c != toupper(candidates[i][match_len]))
                                all_candidates_matches = false;
                        if (!all_candidates_matches)
                            break;
                        match_len++;
                    }

                    if (match_len > 0)
                    {
                        data->DeleteChars((int)(word_start - data->Buf), (int)(word_end-word_start));
                        data->InsertChars(data->CursorPos, candidates[0], candidates[0] + match_len);
                    }

                    // List matches
                    AddLog("Possible matches:\n");
                    for (int i = 0; i < candidates.Size; i++)
                        AddLog("- %s\n", candidates[i]);
                }

                break;
            }
        case ImGuiInputTextFlags_CallbackHistory:
            {
                // Example of HISTORY
                const int prev_history_pos = HistoryPos;
                if (data->EventKey == ImGuiKey_UpArrow)
                {
                    if (HistoryPos == -1)
                        HistoryPos = History.Size - 1;
                    else if (HistoryPos > 0)
                        HistoryPos--;
                }
                else if (data->EventKey == ImGuiKey_DownArrow)
                {
                    if (HistoryPos != -1)
                        if (++HistoryPos >= History.Size)
                            HistoryPos = -1;
                }

                // A better implementation would preserve the data on the current input line along with cursor position.
                if (prev_history_pos != HistoryPos)
                {
                    const char* history_str = (HistoryPos >= 0) ? History[HistoryPos] : "";
                    data->DeleteChars(0, data->BufTextLen);
                    data->InsertChars(0, history_str);
                }
            }
        }
        return 0;
    }
};

void WebOS::ShowExampleAppConsole(bool* p_open)
{
    static ExampleAppConsole console;
    console.Draw("IoTeX Console", p_open);
}