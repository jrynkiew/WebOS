#
# Makefile to use with emscripten
# See https://emscripten.org/docs/getting_started/downloads.html
# for installation instructions. This Makefile assumes you have
# loaded emscripten's environment.
#
# Running make -f Makefile.emscripten will produce three files:
#  - example_sdl_opengl3.html
#  - example_sdl_opengl3.js
#  - example_sdl_opengl3.wasm
#
# All three are needed to run the demo.
ifeq ($(LINUX), 1)
CC = gcc
CXX = g++

OUTPUTFOLDER = out/Linux/

#To fix, EXE should always be the same, the debug or not debug should only change behaviour, not specify different variables
EXE = $(OUTPUTFOLDER)WebOS

SOURCES = src/main.cpp
SOURCES += src/WebOS/imgui_impl_sdl.cpp src/WebOS/imgui_impl_opengl3.cpp
SOURCES += src/WebOS/imgui.cpp src/WebOS/imgui_draw.cpp src/WebOS/imgui_widgets.cpp src/WebOS/imgui_tables.cpp
SOURCES += src/WebOS/webos.cpp src/WebOS/webos_window.cpp src/WebOS/webos_image.cpp src/WebOS/webos_icon.cpp src/WebOS/webos_console.cpp src/WebOS/webos_wallet.cpp
SOURCES += $(GL3W_SRC)
SOURCES += src/WebOS/library_keccak.cpp src/WebOS/library_texteditor.cpp

OBJS = $(addsuffix .o, $(basename $(notdir $(SOURCES))))
OUTPUTOBJS = $(addprefix $(OUTPUTFOLDER), $(OBJS))

UNAME_S := $(shell uname -s)

# for the std::functional hack
CXXFLAGS = -std=c++11
#LIBDIR = -L/home/jeremi-solus/Coding/libraries/SDL2/out/lib
#LIBDIR += -L/home/jeremi-solus/Coding/libraries/SDL2_image-2.0.5/out/lib
#LIBDIR += -L/home/jeremi-solus/Coding/libraries/Xorg/lib
#LIBDIR += -L/home/jeremi-solus/Coding/libraries/glfw/out/lib64
#LIBDIR += -L/usr/lib64

# include ImGui required folders
CPPFLAGS += -I$(GL3W_INCLUDE)

# include WebOS folders
CPPFLAGS += -Isrc/WebOS -Isrc/WebOS/include

# include 3rd party libraires
CPPFLAGS += -Iusr/local/include

CPPFLAGS += -g -Wall -Wformat -O3

LIBS = -lSDL2 -lX11 -lSDL2_image -ldl -lm -lGL -lGLEW -lGLU -lpthread -lXi -lXrandr -lXxf86vm -lXinerama -lXcursor -lrt -pthread -lcurl

##---------------------------------------------------------------------
## BUILD RULES
##---------------------------------------------------------------------
%.o:$(GL3W_SRC)%.c
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c -o $(OUTPUTFOLDER)$@ $<

%.o:src/%.cpp
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c -o $(OUTPUTFOLDER)$@ $<

%.o:src/WebOS/%.cpp
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c -o $(OUTPUTFOLDER)$@ $<

all: $(EXE)
	@echo Release build complete for $(EXE)

$(EXE): $(OBJS)
	@echo $(OUTPUTOBJS)
	$(CXX) -o $@ $(OUTPUTOBJS) -L$(LD_LIBRARY_PATH) $(LIBDIR) $(LIBS) $(LDFLAGS)

clean:
	rm -f $(EXE) $(OUTPUTOBJS) 
	
else	
CC = emcc
CXX = em++

OUTPUTFOLDER = out/WASM/

#To fix, EXE should always be the same, the debug or not debug should only change behaviour, not specify different variables
ifneq ($(DEBUG), 1)

HTMLINPUT = html/index.html html/style.css
HTMLOUTPUT = $(addprefix $(OUTPUTFOLDER), $(notdir $(HTMLINPUT)))
JAVASCRIPT = $(addsuffix .js, $(basename $(notdir $(EXE))))
DATA = $(addsuffix .data, $(basename $(notdir $(EXE))))
WASM = $(addsuffix .wasm, $(basename $(notdir $(EXE))))
RELEASEFILES = $(addprefix $(OUTPUTFOLDER), $(JAVASCRIPT) $(WASM) $(DATA))

EXE = $(OUTPUTFOLDER)WebOS.js

else

EXE = $(OUTPUTFOLDER)Debug.html

JAVASCRIPT = $(addsuffix .js, $(basename $(notdir $(EXE))))
WASM = $(addsuffix .wasm, $(basename $(notdir $(EXE))))
DEBUGDATA = $(addsuffix .data, $(basename $(notdir $(EXE))))
DEBUGFILES = $(addprefix $(OUTPUTFOLDER), $(JAVASCRIPT) $(WASM) $(DEBUGDATA))

endif

SOURCES = src/main.cpp
SOURCES += src/WebOS/imgui_impl_sdl.cpp src/WebOS/imgui_impl_opengl3.cpp
SOURCES += src/WebOS/imgui.cpp src/WebOS/imgui_draw.cpp src/WebOS/imgui_widgets.cpp src/WebOS/imgui_tables.cpp
SOURCES += src/WebOS/webos.cpp src/WebOS/webos_window.cpp src/WebOS/webos_image.cpp src/WebOS/webos_icon.cpp src/WebOS/webos_console.cpp src/WebOS/webos_wallet.cpp
SOURCES += src/WebOS/keccak.cpp

OBJS = $(addsuffix .o, $(basename $(notdir $(SOURCES))))
OUTPUTOBJS = $(addprefix $(OUTPUTFOLDER), $(OBJS))

UNAME_S := $(shell uname -s)

EMS = -s USE_SDL=2 -s USE_SDL_IMAGE=2 -s USE_WEBGL2=1 -s WASM=1 -s FULL_ES3=1
EMS += -s ALLOW_MEMORY_GROWTH=1
EMS += -s DISABLE_EXCEPTION_CATCHING=1 -s EXIT_RUNTIME=1
EMS += -s ASSERTIONS=1 -s SAFE_HEAP=1
EMS += --preload-file images/wallpaper.png --preload-file images/io1m43dzu4q5klmhu9yffperyrugu8dag58kq9syu.png --preload-file fonts/DroidSans.ttf --use-preload-plugins
EMS += -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'

#enable fetching like curl from within emscripten
EMS += -s FETCH=1
#enable asyncify
EMS += -s ASYNCIFY -s 'ASYNCIFY_IMPORTS=["emscripten_asm_const_int", "emscripten_asm_const_async_on_main_thread"]'

#enable BOOST library for 4096 ints
EMS += -s USE_BOOST_HEADERS=1

ifeq ($(DEBUG), 1)
EMS += --profiling  
endif

# for the std::functional hack
CXXFLAGS = -std=c++11

# include WebOS folders
CPPFLAGS += -Isrc/WebOS -Isrc/WebOS/include

CPPFLAGS += -g -Wall -Wformat -O3
CPPFLAGS += $(EMS)
LIBS = $(EMS)

##---------------------------------------------------------------------
## BUILD RULES
##---------------------------------------------------------------------

%.o:src/%.cpp
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c -o $(OUTPUTFOLDER)$@ $<
	
%.o:src/WebOS/%.cpp
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c -o $(OUTPUTFOLDER)$@ $<

%.o:src/ImGui/examples/libs/gl3w/GL/%.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c -o $(OUTPUTFOLDER)$@ $<

ifneq ($(DEBUG), 1)
all: $(EXE)
	cp -f $(HTMLINPUT) $(OUTPUTFOLDER)
	@echo Release build complete for $(EXE)
else
all: $(EXE)
	@echo Debug build complete for $(EXE)
endif

$(EXE): $(OBJS)
	@echo $(OUTPUTOBJS)
	$(CXX) -o $@ $(OUTPUTOBJS) $(LIBS) $(LDFLAGS)

clean:
	rm -f $(EXE) $(OUTPUTOBJS) $(HTMLOUTPUT) $(DEBUGFILES) $(RELEASEFILES)
	
endif
	
# #
# # Compiler flags
# #
# CC     = gcc
# CFLAGS = -Wall -Werror -Wextra

# #
# # Project files
# #
# SRCS = file1.c file2.c file3.c file4.c
# OBJS = $(SRCS:.c=.o)
# EXE  = exefile

# #
# # Debug build settings
# #
# DBGDIR = debug
# DBGEXE = $(DBGDIR)/$(EXE)
# DBGOBJS = $(addprefix $(DBGDIR)/, $(OBJS))
# DBGCFLAGS = -g -O0 -DDEBUG

# #
# # Release build settings
# #
# RELDIR = release
# RELEXE = $(RELDIR)/$(EXE)
# RELOBJS = $(addprefix $(RELDIR)/, $(OBJS))
# RELCFLAGS = -O3 -DNDEBUG

# .PHONY: all clean debug prep release remake

# # Default build
# all: prep release

# #
# # Debug rules
# #
# debug: $(DBGEXE)

# $(DBGEXE): $(DBGOBJS)
    # $(CC) $(CFLAGS) $(DBGCFLAGS) -o $(DBGEXE) $^

# $(DBGDIR)/%.o: %.c
    # $(CC) -c $(CFLAGS) $(DBGCFLAGS) -o $@ $<

# #
# # Release rules
# #
# release: $(RELEXE)

# $(RELEXE): $(RELOBJS)
    # $(CC) $(CFLAGS) $(RELCFLAGS) -o $(RELEXE) $^

# $(RELDIR)/%.o: %.c
    # $(CC) -c $(CFLAGS) $(RELCFLAGS) -o $@ $<

# #
# # Other rules
# #
# prep:
    # @mkdir -p $(DBGDIR) $(RELDIR)

# remake: clean all

# clean:
    # rm -f $(RELEXE) $(RELOBJS) $(DBGEXE) $(DBGOBJS)
