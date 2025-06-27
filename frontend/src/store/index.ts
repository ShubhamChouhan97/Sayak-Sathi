import { createAppStore } from "./app-store";
import { MainClient } from "../client";
import { UserClient } from "../client/users";
import { CourtClient } from "../client/courts";
// import { AppConfig } from "../config/index";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const mainClient = new MainClient(backendUrl);
export const userClient = new UserClient(backendUrl);
export const courtClient = new CourtClient(backendUrl);

export const useAppStore = createAppStore(mainClient);
