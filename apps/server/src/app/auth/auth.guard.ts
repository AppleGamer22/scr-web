import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "@scr-gui/server-schemas";
import { ScrapeRequest } from "@scr-gui/server-interfaces";
import { Model } from "mongoose";
import { Request } from "express";

@Injectable() export class AuthGuard implements CanActivate {
	constructor(private readonly jwt: JwtService, @InjectModel("Users") private readonly Users: Model<User>) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			let request = context.switchToHttp().getRequest<Request>();
			const webToken = request.headers.authorization;
			const userDetails = await this.jwt.verifyAsync<{username: string, U_ID: string}>(webToken);
			if ((await this.Users.findById(userDetails.U_ID).exec()) !== null) {
				(request as ScrapeRequest).user = userDetails;
				return true
			} else return false
		} catch (error) {
			throw new HttpException("Authentication failed.", HttpStatus.UNAUTHORIZED);
		}
	}
}
