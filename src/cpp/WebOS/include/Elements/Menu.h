#pragma once
//ImGui headers
#include "WebOS.h"

class WebOS_Menu {
private:
	ImVec2 menuSize = ImVec2(300, 600);
	bool MenuToggle = false;
public:
	ImVec2& getMenuSize();
	void setShowMainMenu();
	void showMainMenu();
};