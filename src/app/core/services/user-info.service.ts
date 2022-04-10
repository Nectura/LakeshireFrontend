import { Injectable } from "@angular/core";
import jwtDecode from "jwt-decode";

@Injectable({
    providedIn: "root"
})
export class UserInfoService {
    userId: string | null = null;

    updateFromJwtToken(jwtToken: string) {
        const userClaims = jwtDecode<IUserClaims>(jwtToken);
        this.userId = userClaims.sub;
    }

    reset() {
        this.userId = null;
    }
}

interface IUserClaims {
    sub: string;
}