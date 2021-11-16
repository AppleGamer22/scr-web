import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable() export class AuthInterceptor implements HttpInterceptor {
	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const protectedURLs = [
			`${environment.server}/api/auth/categories`,
			`${environment.server}/api/auth/categories`,
			`${environment.server}/api/highlight/`,
			`${environment.server}/api/history/`,
			`${environment.server}/api/instagram/`,
			`${environment.server}/api/story/`,
			`${environment.server}/api/tiktok/`,
			`${environment.server}/api/vsco/`,
			`${environment.server}/api/storage/`,
		];
		if (protectedURLs.find(url => request.url.startsWith(url))) {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = request.headers.set("Authorization", token);
				const updatedRequest = request.clone({ headers });
				return next.handle(updatedRequest);
			} else {
				throw new HttpErrorResponse({
					status: HttpStatusCode.Unauthorized,
					url: request.url,
					statusText: "Authentication failed."
				});
			}
		}
		return next.handle(request);
	}
}
