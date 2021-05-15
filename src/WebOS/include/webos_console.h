#pragma once

// ImGui headers
#include "imgui.h"
#include "imgui_internal.h"

// Standard headers
#include <string>

// Vector headers
#include <vector>

// Curl related headers
#include "/usr/include/curl/curl.h"
#if defined(__EMSCRIPTEN__)
#include <emscripten.h>
#include <emscripten/fetch.h>
#endif

class webos_console
{
private:
    std::string           method;
    std::string           data;
    std::string           url;
    std::string*          consoleBufferPtr;
    std::string           consoleBuffer;
    std::string           requestDataBuffer;

    curl_slist*           curl_headers=NULL;                  //for binaries using curl natively
    std::vector<const char*> emsc_headers;                    //for emscripten
    
    int                   requestDataBufferSize;
    int                   HistoryPos;               // -1: new line, 0..History.Size-1 browsing history.
    bool                  AutoScroll;
    bool                  ScrollToBottom;
    char                  InputBuf[256];
    char                  _return;

    ImVector<char*>       Items;
    ImVector<const char*> Commands;
    ImVector<char*>       History;
    ImVector<const char*> CommandParameters;

    CURL*                 curl;
  	CURLcode              res;

  	ImGuiTextFilter       Filter;

    void ExecCommand(const char* command_line);

    static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void* userp) { webos_console* _this = (webos_console*)userp; _this->AddLog((char*)contents); return size * nmemb; }
    static int InputCallback(ImGuiInputTextCallbackData* data)  { ImGuiWindow* window = ImGui::GetCurrentWindow(); const ImGuiID ConsoleWindowId = window->GetID("Console"); webos_console* _this = (webos_console*)data->UserData;  return 0; }

    int     Strnicmp(const char* str1, const char* str2, int n) { int d = 0; while (n > 0 && (d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; n--; } return d; }
    int     Stricmprlx(const char* str1, const char* str2)      { int d; while ((d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; if(*str1 == ' ') {return d;} if(!*str2) {return d;}} return d; }
    int     Stricmp(const char* str1, const char* str2)         { int d; while ((d = toupper(*str2) - toupper(*str1)) == 0 && *str1) { str1++; str2++; } return d; }
    char*   Strdup(const char *str)                             { size_t len = strlen(str) + 1; void* buf = malloc(len); IM_ASSERT(buf); return (char*)memcpy(buf, (const void*)str, len); }
    void    Strtrim(char* str)                                  { char* str_end = str + strlen(str); while (str_end > str && str_end[-1] == ' ') str_end--; *str_end = 0;}
    char*   Strcat(char * dst, const char * src)                { char *p = dst; while (*p){++p;}while (*p++ = *src++);return dst;}
    char*   Strmbtok ( char *input, char *delimit, char *openblock, char *closeblock) { static char *token = NULL; char *lead = NULL; char *block = NULL; int iBlock = 0; int iBlockIndex = 0; if ( input != NULL) { token = input; lead = input; } else { lead = token; if ( *token == '\0') { lead = NULL; } } while ( *token != '\0') { if ( iBlock) { if ( closeblock[iBlockIndex] == *token) { iBlock = 0; } token++; continue; } if ( ( block = strchr ( openblock, *token)) != NULL) { iBlock = 1; iBlockIndex = block - openblock; token++; continue; } if ( strchr ( delimit, *token) != NULL) { *token = '\0'; token++; break; } token++; } return lead; }
    bool    isNumber(const std::string& str)                    { for (char const &c : str) { if (std::isdigit(c) == 0) return false; } return true; }

    void setMethod(const char * _method)                        { method = _method;}
    void setHeaders(std::vector<const char*> _headers)          { emsc_headers = _headers;}
    
    const char * getMethod()                                    { return method.data(); }
    const char ** getHeaders()                                  { return emsc_headers.data(); }
    
    std::string wrapDoubleQuotes(const char * _str)             { std::string result; if(*_str != '\"') { result = '"'; result += _str; result += '"';}  return result; }
    std::string wrapSingleQuotes(const char * _str)             { std::string result; if(*_str != '\'') { result = "'"; result += _str; result += "'";}  return result; }
    
    void execute_curl_command(const char* command_line);
    

    void post(const char * method, void * userp, const char * data, const char * URL);

    void AddLog(const char* str, ...) IM_FMTARGS(2);
    void ClearLog();

    void printCurlHelp();

    #if defined(__EMSCRIPTEN__)
    static void onLoaded(emscripten_fetch_t *fetch)             { webos_console* _this = (webos_console*)fetch->userData; _this->consoleBuffer.append((char*)fetch->data, fetch->totalBytes); _this->consoleBuffer.append(std::string("\n")); emscripten_fetch_close(fetch); }
    static void onError(emscripten_fetch_t *fetch)              { std::string error = std::string("[error] Connection Failed!\n") + fetch->url + " - HTTP failure status code: " + std::to_string(fetch->status) + std::string("\n"); webos_console* _this = (webos_console*)fetch->userData; _this->consoleBuffer.append(error); _this->consoleBuffer.append(std::string("\n")); emscripten_fetch_close(fetch); }
    #endif

public:
    const void Draw(const char* title, bool* p_open);

    webos_console(/* args */);
    ~webos_console();
};

