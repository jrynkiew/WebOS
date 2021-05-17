#pragma once

// ImGui headers
#include "imgui.h"
#include "imgui_internal.h"
#include "imgui_impl_sdl.h"
#include "imgui_impl_opengl3.h"

// SDL2 headers
#include <SDL.h>
#include <SDL_image.h>

// Standard headers
#include <string>
#include <iostream>
#include <cmath>

#if defined(__EMSCRIPTEN__)
#include <emscripten.h>
#include <SDL_opengles2.h>
#elif defined(IMGUI_IMPL_OPENGL_LOADER_GL3W)
#include <GL/gl3w.h>    // Initialize with gl3wInit()
#elif defined(IMGUI_IMPL_OPENGL_LOADER_GLEW)
#include <GL/glew.h>    // Initialize with glewInit()
#elif defined(IMGUI_IMPL_OPENGL_LOADER_GLAD)
#include <glad/glad.h>  // Initialize with gladLoadGL()
#else
#include IMGUI_IMPL_OPENGL_LOADER_CUSTOM
#endif

#include <stdio.h>

// WebOS headers
#include "webos_image.h"
#include "webos_icon.h"
#include "webos_console.h"

namespace ImGui
{
	// WebOS Set Styles
	IMGUI_API void          StyleColorsIoTeX(ImGuiStyle* dst = NULL);

	// WebOS Welcome Popup 
	IMGUI_API void        	ShowWebOSInterface(void* _interface = NULL); 

	// Toggle WebOS main menu on/off
	IMGUI_API void        	WebOS_ToggleMainMenu(bool* p_open = NULL);

	// WebOS Show IoTeX Console
	//IMGUI_API void        	WebOS_ShowExampleAppConsole(bool* p_open = NULL);

	// WebOS Clickable Image Button
	IMGUI_API void        	showIcon();
}

namespace WebOS_namespace {

}

class WebOS {
private:
	//this needs to be webos_style class
	struct WebOS_style {
		ImVec4 backgroundColor;
		ImVec2 WindowPadding;
		ImVec2 FramePadding;
		ImVec2 ItemSpacing;
		ImVec2 ItemInnerSpacing;
		ImVec2 TouchExtraPadding;
		float IndentSpacing;
		float FrameRounding;
		float ScrollbarSize;
		float GrabMinSize;
		float WindowBorderSize;
		float ChildBorderSize;
		float PopupBorderSize;
		float FrameBorderSize;
		float TabBorderSize;
		float WindowRounding;
		float ChildRounding;
		float GrabRounding;
		ImVec2 iconSize;
	};

	ImGuiStyle* imGuiStylePtr; 
	WebOS_style style;


public:
	webos_console console;
	ImVector<webos_image*> images;
	ImVector<webos_icon*> icons;

	WebOS getPtr() {return *this;}

	bool setup_docking = true;

	ImGuiID dockspaceID = NULL;
	ImGuiID dock_left = NULL;

 	void setStyle();
	 WebOS_style* getStyle() { return &style; }
	
	WebOS();
	~WebOS();
};

#ifndef WEBOS_API
#define WEBOS_API
#endif
#ifndef WEBOS_IMPL_API
#define WEBOS_IMPL_API              WEBOS_API
#endif

