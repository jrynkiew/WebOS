#include "webos_image.h"

webos_image::webos_image(const char* file)
{
    loadTextureFromFile(file, &textureID);
}
webos_image::~webos_image()
{
}

void webos_image::loadTextureFromFile(const char* file, GLuint* textureID) {
    SDL_Surface* original = IMG_Load(file);
    if(!original)
    {
        printf("Error in loadTextureFromFile: %s\n", IMG_GetError());
    }
    SDL_Surface* converted = SDL_CreateRGBSurface(0, original->w, original->h, 24, 0x0000FF, 0x00FF00, 0xFF0000, 0x000000);
    if(!converted)
    {
        printf("Error in loadTextureFromFile: %s\n", IMG_GetError());
    }
    SDL_BlitSurface(original, NULL, converted, NULL);

    glGenTextures(1, textureID);
    glBindTexture(GL_TEXTURE_2D, *textureID);

    int Mode = GL_RGB;

    if (original->format->BytesPerPixel == 4) {
        Mode = GL_RGBA;
    }

    glTexImage2D(GL_TEXTURE_2D, 0, Mode, original->w, original->h, 0, Mode, GL_UNSIGNED_BYTE, original->pixels);

    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
}