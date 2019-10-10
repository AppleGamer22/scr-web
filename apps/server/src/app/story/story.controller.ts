import { Controller } from "@nestjs/common";
import { StoryService } from "./story.service";

@Controller("story") export class StoryController {
	constructor(private readonly storyService: StoryService) {}
}
