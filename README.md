# 1. Install emscripten

+ Get the emsdk repo

*git clone https://github.com/emscripten-core/emsdk.git*

+ Enter that directory

*cd emsdk*

+ Fetch the latest version of the emsdk (not needed the first time you clone)

*git pull*

+ Download and install the latest SDK tools.

*./emsdk install latest*

+ Make the "latest" SDK "active" for the current user. (writes ~/.emscripten file)

*./emsdk activate latest*

+ Activate PATH and other environment variables in the current terminal

*source ./emsdk_env.sh*


# 2. Install make

+ Get the make installer

##### For Windows 10

*http://gnuwin32.sourceforge.net/packages/make.htm*

##### For Linux (Ubuntu)

*sudo apt-get install build-essential*

##### For Linux (CentOS)

*yum groupinstall "Development Tools"*

+ install make using default settings

+ add make directory to Windows PATH environment variables

**Linux installers should have make functionality enabled by default after installation**


# 3. Install Docker

Docker installation is recommended only on Linux systems, since installing Docker for Windows will render VirtualBox useless, since it requires the Hyper-V hypervisor to be enabled, which is a type 1 hypervisor, in contrast to Oracle VirtualBox, which is a type 2 hypervisor.

# 4. Make the Application
+ Install using this command  (on Windows x64 & 32bit)

*setEmscriptenEnvsWin32.bat* **make sure you edit this file to target your installation of the emscripten sdk**

*make*

+ Install using this command  (on Linux)

*setEmscriptenEnvsLinux.sh* **make sure you edit this file to target your installation of the emscripten sdk**

*make*

**May need to use emmake make in some cases**

**hint: if you want to make a debug build, use this syntax**

*make DEBUG=1* 

**remember to clean up debug files with**

*make clean DEBUG=1* or *make clean* to remove regular output files


# 5. Install SDL2

The version used in last successful compilation is SDL2-2.0.12

The emscripten compiler will use SDL 2.0.0 libraries


# 6. Install SDL2_Image

The version used in last successful compilation is SDL2_image-2.0.5

The emscripten compiler will use SDL Image 2.0.0 libraries
