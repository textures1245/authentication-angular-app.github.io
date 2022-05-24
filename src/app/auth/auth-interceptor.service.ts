import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";
import { User } from "./user.model";

@Injectable({
    providedIn: "root"
})

export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService._user.pipe(
            take(1), //* take only lasted user then unsubscribed
            exhaustMap((user: User) => {
                if (!user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params: new HttpParams().set("auth", <string>user.token) 
                })
                return next.handle(modifiedReq);
            })
        )
    }
}