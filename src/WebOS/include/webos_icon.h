#pragma once
// WebOS headers
#include "webos_image.h"

class webos_icon
{
private:
    bool p_open;
    webos_image* image;
    float sizeX;
    float sizeY;
public:

    void* getIconImage()    { return image->getImage(); };
    float getIconSizeX()    { return sizeX; }
    float getIconSizeY()    { return sizeY; }
    webos_icon(const char* file, float _sizeX, float _sizeY);
    webos_icon();
    ~webos_icon();
};

