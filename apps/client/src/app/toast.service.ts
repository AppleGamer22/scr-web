import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({providedIn: "root"}) export class ToastService {
	constructor(private readonly toastController: ToastController) {}
	async showToast(message: string, type: "danger" | "success") {
		try {
			const toast = await this.toastController.create({
				message: message,
				duration: 5000,
				showCloseButton: true,
				position: "top",
				closeButtonText: "OK",
				animated: true,
				color: type
			});
			toast.present();
		} catch (error) {
			console.error((error as Error).message);
		}
	}
}
