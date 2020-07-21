import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable() export class ToastService {
	constructor(private readonly toastController: ToastController) {}
	/**
	 *  Displays a toast with a message and type
	 * @param message message to display
	 * @param type toast type
	 */
	async showToast(message: string, type: "danger" | "success") {
		try {
			const toast = await this.toastController.create({
				message,
				buttons: [{
					text: "OK",
					role: "cancel"
				}],
				duration: 5000,
				position: "top",
				animated: true,
				color: type
			});
			toast.present();
		} catch (error) {}
	}
}
