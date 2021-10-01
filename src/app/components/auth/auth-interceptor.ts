import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        
        const authToken = this.authService.getAuthToken();

        const authReq = req.clone({setHeaders: {Authorization: authToken}});

        return next.handle(authReq);
    }
}