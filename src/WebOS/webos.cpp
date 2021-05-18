#pragma once
#include "webos.h"

WebOS::WebOS() {
	//Initiate connection to ImGui Style pointer
	this->imGuiStylePtr = &ImGui::GetStyle();

    // Set WebOS style
    setStyle(); 

    //Load WebOS icons
    webos_icon*	icon_JRPC = new webos_icon("images/io1m43dzu4q5klmhu9yffperyrugu8dag58kq9syu.png", 32, 32);
    icons.push_back(icon_JRPC);
    webos_icon* icon_WebOS = new webos_icon("images/wallpaper.png", 32, 32);
    icons.push_back(icon_WebOS);

    //Load WebOS images
    webos_image* image_WebOS_wallpaper = new webos_image("images/wallpaper.png");
    images.push_back(image_WebOS_wallpaper);
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
    this->style.iconSize = ImVec2(32.0f/32, 32.0f/32);

}