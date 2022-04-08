import { Injectable } from "@angular/core";
import { AuthType } from "../enums/auth-type";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    accessToken: string | null;
    refreshToken: string | null;

    constructor() {
        this.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY);
        this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) ?? sessionStorage.getItem(REFRESH_TOKEN_KEY);
    }

    isAuthenticated() {
        return this.accessToken !== null;
    }

    logOut() {
        // persistent login
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        // browser session login
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
        this.accessToken = null;
        this.refreshToken = null;
    }

    updateToken(accessToken: string, refreshToken: string, authType: AuthType) {
        switch (authType) {
            case AuthType.LocalStorage:
                localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
                break;
            case AuthType.Session:
                sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
                break;
        }
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";