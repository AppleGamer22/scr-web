import { Controller } from "@nestjs/common";
import { HighlightService } from "./highlight.service";

@Controller("highlight") export class HighlightController {
	constructor(private readonly highlightService: HighlightService) {}
}