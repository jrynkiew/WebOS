#pragma once
//ImGui headers
#include "imgui.h"
#include <SDL.h>
#include <SDL_image.h>
#include "imgui_impl_sdl.h"
#include "imgui_impl_opengl3.h"

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

class WebOS {
private:
	struct WebOS_style {
		ImVec4 backgroundColor;
		ImVec2 WindowPadding;
		ImVec2 FramePadding;
		ImVec2 ItemSpacing;
		ImVec2 ItemInnerSpacing;
		ImVec2 TouchExtraPadding;
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
	};

	ImGuiStyle* imGuiStylePtr; 
	WebOS_style style;
	GLuint icon = 0;
	void loadTextureFromFile(const char* file, GLuint* textureID);
	bool showContextMenu = false;
	//Still not implemented - the actual menu appeas because of imgui_demo.cpp  static bool show_app_main_menu_bar = true;
	static void ShowHookMenu();
	static void ShowMenuFile();
public:
	bool getShowContextMenu(){ return showContextMenu; }
	void setShowContextMenu(bool target) { showContextMenu = target; }
	void ShowStartHook(bool* p_open);
 	void setStyle();
	ImVec4* getBackgroundColor();
	void showIcon();
	void showRightClickContextMenu();

	WebOS();
	~WebOS();
};

#ifndef WEBOS_API
#define WEBOS_API
#endif
#ifndef WEBOS_IMPL_API
#define WEBOS_IMPL_API              WEBOS_API
#endif

