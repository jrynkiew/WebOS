#pragma once
//ImGui headers
#include "WebOS.h"

class WebOS_Menu {
private:
	ImVec2 menuSize = ImVec2(150, 75);
	bool MenuToggle = false;
public:
	ImVec2& getMenuSize();

	void setShowMainMenu();
	void setShowMainMenuBar();

	void showMainMenu();
	void showMainMenuBar();
};