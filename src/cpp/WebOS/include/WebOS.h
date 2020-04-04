#pragma once
//ImGui headers
#include "imgui.h"
#include "imgui_impl_sdl.h"
#include "imgui_impl_opengl3.h"

//SDL headers
#include <SDL.h>
#include <SDL_image.h>

//Windows headers
#include <stdio.h>

#pragma comment(lib, "shell32.lib")

// About OpenGL function loaders: modern OpenGL doesn't have a standard header file and requires individual function pointers to be loaded manually.
// Helper libraries are often used for this purpose! Here we are supporting a few common ones: gl3w, glew, glad.
// You may use another loader/header of your choice (glext, glLoadGen, etc.), or chose to manually implement your own.
// When compiling with emscripten however, no specific loader is necessary, since the webgl wrapper will do it for you.
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

#ifndef WEBOS_API
#define WEBOS_API
#endif
#ifndef WEBOS_IMPL_API
#define WEBOS_IMPL_API              WEBOS_API
#endif

namespace WebOS {
	namespace {
		SDL_Window* window;
		SDL_GLContext gl_context;
	}
	bool createSDL_Window();

}
