#include "webos_icon.h"

webos_icon::webos_icon()
{
}

webos_icon::webos_icon(const char* file, float _sizeX, float _sizeY)
{
    image = new webos_image(file);
    p_open = false;
    sizeX = _sizeX;
    sizeY = _sizeY;
}

webos_icon::~webos_icon()
{
}

/*
void WebOS::showIcon()
{
    static bool test = true;
    if(true)
    {
        ShowExampleAppConsole(&test);
    }
    ImVec2 iconSize = ImVec2(32.0f/32, 32.0f/32);
    ImGui::SetNextWindowPos(ImVec2(ImGui::GetIO().DisplaySize.x/69, ImGui::GetIO().DisplaySize.y/2));
    ImGui::Begin("JRPC_Icon", NULL, ImGuiWindowFlags_NoNav | ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoBackground);
        if (ImGui::ImageButton((void*)(intptr_t)icon, ImVec2(32,32), ImVec2(0,0), iconSize, 3, ImVec4(0.0f,0.0f,0.0f,0.0f)))
        {
            test = !test;
            
            printf("JRPC icon clicked \n");
        }
    ImGui::End();
}*/