import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { TOKEN_REFRESH_ENDPOINT } from "src/app/constants/auth-endpoints";
import { JwtTokenResponse } from "src/app/features/login-form/models/JwtTokenResponse";
import { environment } from "src/environments/environment";
import { UserInfoService } from "./user-info.service";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private accessToken: string | null;
    private refreshToken: string | null;
    private isPersistentLogin: boolean;

    constructor(
        private readonly httpClient: HttpClient,
        private readonly userInfoService: UserInfoService) {
        this.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY);
        this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) ?? sessionStorage.getItem(REFRESH_TOKEN_KEY);
        this.isPersistentLogin = this.accessToken !== null && localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
        if (this.accessToken !== null) {
            this.userInfoService.updateFromJwtToken(this.accessToken);
        }
    }

    isAuthenticated() {
        return this.accessToken !== null;
    }

    logOut() {
        if (this.isPersistentLogin) {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        } else {
            sessionStorage.removeItem(ACCESS_TOKEN_KEY);
            sessionStorage.removeItem(REFRESH_TOKEN_KEY);
        }
        this.accessToken = null;
        this.refreshToken = null;
    }

    updateToken(accessToken: string, refreshToken: string, isPersistentLogin: boolean) {
        if (this.isPersistentLogin) {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        } else {
            sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.isPersistentLogin = isPersistentLogin;
        this.userInfoService.updateFromJwtToken(accessToken);
    }

    refreshAccessToken() {
        this.httpClient.post<JwtTokenResponse>(environment.authServer + TOKEN_REFRESH_ENDPOINT, {
            userId: this.userInfoService.userId,
            refreshToken: this.refreshToken
        }).subscribe({
            next: (response) => {
                this.updateToken(response.accessToken, response.refreshToken, this.isPersistentLogin);
                console.info("Refreshed the JWT token.");
            },
            error: (ex) => {
                const errorResponse = ex as HttpErrorResponse;
                console.error("Failed to refresh the JWT token: [" + errorResponse.status + "] " + errorResponse.message);
            }
        });
    }

    getAccessToken() {
        return this.accessToken;
    }
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";