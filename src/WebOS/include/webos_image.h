#pragma once
// SDL2 headers
#include <SDL_image.h>

// GL headers
#include <GL/gl.h>

class webos_image
{
private:
    GLuint textureID = 0;
    
public:
    GLuint getImage() {return textureID;};
    void loadTextureFromFile(const char* file, GLuint* textureID);

    webos_image();
    webos_image(const char* file);
    ~webos_image();
};

