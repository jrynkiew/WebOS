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

CC = emcc
CXX = em++

OUTPUTFOLDER = out/WASM/

#To fix, EXE should always be the same, the debug or not debug should only change behaviour, not specify different variables
ifneq ($(DEBUG), 1)

HTMLINPUT = src/html/index.html src/html/style.css
HTMLOUTPUT = $(addprefix $(OUTPUTFOLDER), $(notdir $(HTMLINPUT)))
JAVASCRIPT = $(addsuffix .js, $(basename $(notdir $(EXE))))
WASM = $(addsuffix .wasm, $(basename $(notdir $(EXE))))
RELEASEFILES = $(addprefix $(OUTPUTFOLDER), $(JAVASCRIPT) $(WASM))

EXE = $(OUTPUTFOLDER)WebOS.js

else

EXE = $(OUTPUTFOLDER)Debug.html

JAVASCRIPT = $(addsuffix .js, $(basename $(notdir $(EXE))))
WASM = $(addsuffix .wasm, $(basename $(notdir $(EXE))))
DEBUGFILES = $(addprefix $(OUTPUTFOLDER), $(JAVASCRIPT) $(WASM))

endif

SOURCES = src/cpp/main.cpp
SOURCES += src/cpp/ImGui/examples/imgui_impl_sdl.cpp src/cpp/ImGui/examples/imgui_impl_opengl3.cpp
SOURCES += src/cpp/ImGui/imgui.cpp src/cpp/ImGui/imgui_demo.cpp src/cpp/ImGui/imgui_draw.cpp src/cpp/ImGui/imgui_widgets.cpp
OBJS = $(addsuffix .o, $(basename $(notdir $(SOURCES))))
OUTPUTOBJS = $(addprefix $(OUTPUTFOLDER), $(OBJS))

UNAME_S := $(shell uname -s)

EMS = -s USE_SDL=2 -s USE_SDL_IMAGE=2 -s USE_WEBGL2=1 -s WASM=1 -s FULL_ES3=1
EMS += -s ALLOW_MEMORY_GROWTH=1
EMS += -s DISABLE_EXCEPTION_CATCHING=1 -s EXIT_RUNTIME=1
EMS += -s ASSERTIONS=1 -s SAFE_HEAP=1

# for the std::functional hack
CXXFLAGS = -std=c++11

CPPFLAGS = -Isrc/cpp/ImGui/ -Isrc/cpp/ImGui/examples/
CPPFLAGS += -g -Wall -Wformat -O3
CPPFLAGS += $(EMS)
LIBS = $(EMS)

##---------------------------------------------------------------------
## BUILD RULES
##---------------------------------------------------------------------

%.o:src/cpp/%.cpp
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c -o $(OUTPUTFOLDER)$@ $<

%.o:src/cpp/ImGui/%.cpp
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c -o $(OUTPUTFOLDER)$@ $<

%.o:src/cpp/ImGui/examples/%.cpp
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c -o $(OUTPUTFOLDER)$@ $<

%.o:src/cpp/ImGui/examples/libs/gl3w/GL/%.c
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