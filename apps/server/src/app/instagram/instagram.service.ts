import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as puppeteer from "puppeteer";

declare global {
	interface Window {
		_sharedData: any
	}
}

@Injectable() export class InstagramService {
	async getPostFiles(id: string, browser: puppeteer.Browser, page: puppeteer.Page): Promise<string[]> {
		try {
			await page.goto(`https://www.instagram.com/p/${id}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("div.error-container")) !== null) {
				console.error(`Failed to find post ${id}`);
				await browser.close();
				throw new HttpException(`Failed to find post ${id}`, HttpStatus.NOT_FOUND);
			}
			const sources = await page.evaluate(() => {
				return window._sharedData.entry_data.PostPage[0].graphql.shortcode_media;
			});
			var urls: string[] = [];
			if (sources.edge_sidecar_to_children) {
				for (let edge of sources.edge_sidecar_to_children.edges) {
					if (!edge.node.is_video) urls.push(edge.node.display_url);
					if (edge.node.is_video) urls.push(edge.node.video_url);
				}
			} else {
				if (!sources.is_video) urls.push(sources.display_url);
				if (sources.is_video) urls.push(sources.video_url);
			}
			return urls;
		} catch (error) { console.error(error.message); }
	}
}