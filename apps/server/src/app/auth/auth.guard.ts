import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "@scr-web/server-schemas";
import { ScrapeRequest } from "@scr-web/server-interfaces";
import { Model } from "mongoose";
import { Request } from "express";

@Injectable() export class AuthGuard implements CanActivate {
	constructor(private readonly jwt: JwtService, @InjectModel("Users") private readonly Users: Model<UserDocument>) {}
	/**
	 * decides if a request is allowed to be processed based on authentication
	 * @param context execution context of HTTP request
	 * @returns a Boolean of whether the request is allowed to be processed
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			let request = context.switchToHttp().getRequest<Request>();
			const webToken = request.headers.authorization;
			const userDetails = await this.jwt.verifyAsync<{username: string, U_ID: string}>(webToken);
			if ((await this.Users.findById(userDetails.U_ID).exec()) !== null) {
				(request as ScrapeRequest).user = userDetails;
				return true;
			} else return false;
		} catch (error) {
			throw new HttpException("Authentication failed.", HttpStatus.UNAUTHORIZED);
		}
	}
}
