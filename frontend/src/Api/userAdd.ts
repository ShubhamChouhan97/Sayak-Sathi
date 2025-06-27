
import { mainClient } from "../store"; // adjust the path as needed

export const adduser = async (formData: FormData) => {
	try {
		const response = await mainClient.request("POST", "/api/user/newuser", {
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.status === 200;
	} catch (error) {
		console.error("Error updating user:", error);
		throw error;
	}
};
