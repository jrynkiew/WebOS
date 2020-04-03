@REM Build for Visual Studio compiler. Run your copy of vcvars32.bat or vcvarsall.bat to setup command-line compiler.
set SDL2_DIR=C:\Users\jrz2\Desktop\SOURCE\SDL2-2.0.12
set SDL2_LIB_DIR=C:\Users\jrz2\Desktop\BINARIES\SDL2-2.0.12\Release
set OUT_DIR=Debug
set OUT_EXE=example_sdl_opengl3
set INCLUDES=/I.. /I..\.. /I%SDL2_DIR%\include /I..\libs\gl3w
set SOURCES=main.cpp ..\imgui_impl_sdl.cpp ..\imgui_impl_opengl3.cpp ..\..\imgui*.cpp ..\libs\gl3w\GL\gl3w.c
set LIBS=/libpath:%SDL2_LIB_DIR% SDL2.lib SDL2main.lib opengl32.lib
mkdir %OUT_DIR%
cl /nologo /Zi /MD %INCLUDES% %SOURCES% /Fe%OUT_DIR%/%OUT_EXE%.exe /Fo%OUT_DIR%/ /link %LIBS% /subsystem:console
