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
<<<<<<< HEAD
    ImGui::StyleColorsDark();
	this->style.WindowPadding = this->imGuiStylePtr->WindowPadding				= ImVec2(4, 7);
	this->style.FramePadding = this->imGuiStylePtr->FramePadding				= ImVec2(6, 6);
	this->style.ItemSpacing = this->imGuiStylePtr->ItemSpacing				= ImVec2(20, 20);
	this->style.ItemInnerSpacing = this->imGuiStylePtr->ItemInnerSpacing			= ImVec2(14, 20);
	this->style.TouchExtraPadding = this->imGuiStylePtr->TouchExtraPadding			= ImVec2(10, 10);
	this->style.IndentSpacing = this->imGuiStylePtr->IndentSpacing				= (float)21;
	this->style.FrameRounding = this->imGuiStylePtr->FrameRounding				= (float)3;
	this->style.ScrollbarSize = this->imGuiStylePtr->ScrollbarSize				= (float)20;
	this->style.GrabMinSize = this->imGuiStylePtr->GrabMinSize				= (float)10;
=======
    ImGui::StyleColorsLight();
	this->style.WindowPadding = this->imGuiStylePtr->WindowPadding				= ImVec2(20, 20);
	this->style.FramePadding = this->imGuiStylePtr->FramePadding				= ImVec2(20, 20);
	this->style.ItemSpacing = this->imGuiStylePtr->ItemSpacing				= ImVec2(20, 20);
	this->style.ItemInnerSpacing = this->imGuiStylePtr->ItemInnerSpacing			= ImVec2(20, 20);
	this->style.TouchExtraPadding = this->imGuiStylePtr->TouchExtraPadding			= ImVec2(10, 10);
	this->style.FrameRounding = this->imGuiStylePtr->FrameRounding				= (float)3;
	this->style.ScrollbarSize = this->imGuiStylePtr->ScrollbarSize				= (float)20;
	this->style.GrabMinSize = this->imGuiStylePtr->GrabMinSize				= (float)20;
>>>>>>> 4753c51873e2cf8dd9429e910513809a504d3eb1
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
	//this->style.backgroundColor = ImVec4(0.00f, 0.4f, 0.53f, 1.00f);
	//this->style.backgroundColor = ImVec4(1.00f, 1.0f, 1.00f, 1.00f);
}

ImVec4* WebOS::getBackgroundColor() {
	return &this->style.backgroundColor;
}
/*
void WebOS::ShowStartHook(bool* p_open)
{
    IM_ASSERT(ImGui::GetCurrentContext() != NULL && "Missing dear imgui context. Refer to examples app!"); // Exceptionally add an extra assert here for people confused with initial dear imgui setup

    // Examples Apps (accessible from the "Examples" menu)
    static bool show_WebOS_main_hook = false;

    if (show_WebOS_main_hook)        ShowHookMenu();


    ImGuiWindowFlags window_flags = 0;

    // We specify a default position/size in case there's no data in the .ini file. Typically this isn't required! We only do it to make the Demo applications a little more welcoming.
    ImGui::SetNextWindowPos(ImVec2(0, 0), ImGuiCond_FirstUseEver);

    int height, width;
    SDL_GL_GetDrawableSize(SDL_GL_GetCurrentWindow(), &width, &height);

    ImGui::SetNextWindowSize(ImVec2(width, height), ImGuiCond_FirstUseEver);

    // Main body of the Demo window starts here.
    if (!ImGui::Begin("Demo", p_open, window_flags))
    {
        // Early out if the window is collapsed, as an optimization.
        ImGui::End();
        return;
    }

    // Most "big" widgets share a common width settings by default.
    //ImGui::PushItemWidth(ImGui::GetWindowWidth() * 0.65f);    // Use 2/3 of the space for widgets and 1/3 for labels (default)
    ImGui::PushItemWidth(ImGui::GetFontSize() * -12);           // Use fixed width for labels (by passing a negative value), the rest goes to widgets. We choose a width proportional to our font size.

    // Menu Bar
    if (ImGui::BeginMenuBar())
    {
        if (ImGui::BeginMenu("Menu"))
        {
            ShowMenuFile();
            ImGui::EndMenu();
        }
        ImGui::EndMenuBar();
    }

    // End of ShowDemoWindow()
    ImGui::End();
}*/

void WebOS::showIcon()
{
    //Show Background window
    ImVec2 iconSize = ImVec2(70, 70);
    //ImGui::SetNextWindowPos(ImVec2(10, 10));
    ImGui::SetNextWindowSize(iconSize);
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(0, 0));
    ImGui::PushStyleVar(ImGuiStyleVar_WindowBorderSize, 2);
    ImGui::Begin("Icon1", NULL, ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoNav);
    ImGui::Image((void*)(intptr_t)icon, iconSize);
    ImGui::End();
    ImGui::PopStyleVar();
    ImGui::PopStyleVar();
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
