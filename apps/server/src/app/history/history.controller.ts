import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { Request } from "express";
import { HistoryService } from "./history.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("history") export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}
	@Get("") @UseGuards(AuthGuard) async getHistory(@Req() request: Request) {}
}
