import { mainClient } from "../store"; // Adjust path if needed

export const adduser = async (formData: FormData): Promise<boolean> => {
	try {
		const response = await mainClient.request(
			"POST",
			"/api/user/newuser",
			{
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.status === 200;
	} catch (error) {
		console.error("Error adding user:", error);
		throw error;
	}
};

export const getUsers = async (): Promise<any> => {
	try {
		const response = await mainClient.request("GET", "/api/user/getusers");
		return response.data;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

export const deleteUser = async (id: string): Promise<void> => {
	try {
		const response = await mainClient.request("DELETE", `/api/user/deleteuser/${id}`);
		if (response.status !== 200) {
			throw new Error("Failed to delete user");
        }
		} catch (error) {
			console.error("Error deleting user:", error);
                throw error;
    }
}