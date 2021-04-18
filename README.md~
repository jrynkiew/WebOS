![Image description](https://jrpc.pl/Images/WebOS_banner.png)

Test the resulting project here: https://www.jrpc.pl/

# 1. Install emscripten

Install packaged emscripten if it is available on your distribution. On Solus it is confirmed working

Get the emsdk repo
```
git clone https://github.com/emscripten-core/emsdk.git
```
Enter that directory
```
cd emsdk
```
Fetch the latest version of the emsdk (not needed the first time you clone)
```
git pull
```
Download and install the latest SDK tools.
```
./emsdk install latest
```
Make the "latest" SDK "active" for the current user. (writes ~/.emscripten file)
```
./emsdk activate latest
```
Activate PATH and other environment variables in the current terminal
```
source ./emsdk_env.sh
```

# 2. Install make

Get the make installer

##### For Windows 10

> http://gnuwin32.sourceforge.net/packages/make.htm

##### For Linux (Ubuntu)
```
sudo apt-get install build-essential
```
##### For Linux (CentOS)
```
yum groupinstall "Development Tools"
```
Install make using default settings

Add make directory to Windows PATH environment variables

**Linux installers should have make functionality enabled by default after installation**


# 3. Install SDL2

Get SDL2 from the below address

> https://www.libsdl.org/download-2.0.php

The version used in last successful compilation is SDL2-2.0.12

The emscripten compiler will use SDL 2.0.0 libraries


# 4. Install SDL2_Image

Get SDL2 from the below address

> https://www.libsdl.org/projects/SDL_image/

The version used in last successful compilation is SDL2_image-2.0.5

The emscripten compiler will use SDL Image 2.0.0 libraries

# 5. Install Dear ImGui

Get the latest version from: 

> https://github.com/ocornut/imgui

This step is only necessary on Windows

Last version tested and confirmed working is 
```
#define IMGUI_VERSION               "1.76 WIP"
#define IMGUI_VERSION_NUM           17502
```

Additionally, the main.cpp file from this fork may be useful

> https://github.com/nicolasnoble/imgui


# 6. Install Docker

Docker installation is recommended only on Linux systems, since installing Docker for Windows will render VirtualBox useless, since it requires the Hyper-V hypervisor to be enabled, which is a type 1 hypervisor, in contrast to Oracle VirtualBox, which is a type 2 hypervisor.

# 7. Build and Dockerize the Application

Build backend (if necessary)

```
cd WebOS/backend
./build.sh
```

The backend is now available on port 49160. 
To connect from the frontend to the backend, make sure you enter "http://localhost:49160" in the fetch scripts in WebOS.cpp and recompile

```
make
./LaunchDocker.sh
```

The app is now launched together with the backend and available on port 80.

If you are connecting to backend, you might get "Blocked loading mixed active content" error. This is because you might be hosting this website on https, but connecting to http backend (backend still doesnt support https). If so, change "security.mixed_content.block_active_content" to false in Firefox about:config options

# 8. Windows & Linux WebAssembly builds

**make sure you edit setEmscriptenEnvsWin32.bat or setEmscriptenEnvsLinux.sh to target your installation of the emscripten sdk**

Install using this command  (on Windows x64 & 32bit)

```
setEmscriptenEnvsWin32.bat (optional)
 
make
```
Install using this command  (on Linux)
```
setEmscriptenEnvsLinux.sh (optional)

make
```
The optional parts might be only necessary if you build emscripten yourself from source. Installing emscripten via "apt get install" or other means will set the required paths automatically for you 

##### May need to use emmake make in some cases

If you want to make a debug build, use this syntax**
```
make DEBUG=1
```

remember to clean up regular output files
```
make clean
```

and to clean up debug files
```
make clean DEBUG=1
```
# 9. Build bnaries

##### The default "make" command will build the emscripten binaries, html and js files.

If you want to make a linux build, use this syntax**
```
make LINUX=1
```

Windows builds can be done by modifying the visua studio project files and compiling using the Visual Studio compiler. this is deprecated. Use Linux instead, as Windows building hasn't been tested for a while.


# 10. Required Libs
libpng16-16.dll 211 or 206 kB
zlib1.dll 92kB
glew32.dll
