#pragma once
//ImGui headers
#include "WebOS.h"
#include "Menu.h"
/*
SetNextWindowPos(const ImVec2& pos, ImGuiCond cond = 0, const ImVec2& pivot = ImVec2(0, 0));
SetNextWindowSize(const ImVec2& size, ImGuiCond cond = 0);
*/

WebOS_Menu InitializeMenu;

ImVec2& WebOS_Menu::getMenuSize()
{
    return menuSize;
}

void WebOS_Menu::showMainMenu()
{
    // 1. Show the big demo window (Most of the sample code is in ImGui::ShowDemoWindow()! You can browse its code to learn more about Dear ImGui!).
    if (show_demo_window)
        //This should be WebOS_Window::ShowDemoWindow
        ImGui::ShowDemoWindow(&show_demo_window);
    if (MenuToggle)
    {
        //ImGui::SetNextWindowBgAlpha(0.0f);
        ImGui::SetNextWindowSize(InitializeMenu.getMenuSize());
        //ImGui::SetNextWindowSizeConstraints(InitializeMenu.getMenuSize(), InitializeMenu.getMenuSize());
        //ImGui::SetNextWindowContentSize(InitializeMenu.getMenuSize());

        

        ImGui::Begin("MainMenu", NULL, ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoBackground | ImGuiWindowFlags_NoCollapse | ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoScrollbar);
        ImGui::PushTextWrapPos(0.0f);
        if (ImGui::CollapsingHeader("Main Menu"))
        {
            if (ImGui::SmallButton("Introduction"))
            {
                show_demo_window = true;
            }
            //ImGui::Checkbox("Demo Window", &show_demo_window);      // Edit bools storing our window open/close state
        }
        ImGui::PopTextWrapPos();
        ImGui::End();
        
        //left hand side main menu
    }

    // 3. Show another simple window.
    if (show_another_window)
    {
        ImGui::Begin("Another Window", &show_another_window);   // Pass a pointer to our bool variable (the window will have a closing button that will clear the bool when clicked)
        ImGui::Text("Hello from another window!");
        if (ImGui::Button("Close Me"))
            show_another_window = false;
        ImGui::End();
    }
}

void WebOS_Menu::setShowMainMenu()
{
    if (MenuToggle)
    {
        MenuToggle = false;
    }
    else if (!MenuToggle)
    {
        MenuToggle = true;
    }
    
}