// @ts-ignore
import window from "global/window";
import Antenna from "./index";
import { WsSignerPlugin } from "./plugin/ws/ws";
import { toRau } from "./account/utils";

window.WsSignerPlugin = WsSignerPlugin;
window.Antenna = Antenna;
window.toRau = toRau;

