// src/Api/CreateRequest.ts
import { mainClient } from "../store"; // adjust path if needed

export const createRequest = async (formData: FormData) => {
  const response = await mainClient.request("POST", "/api/request/newrequest",
    {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
   });
  return response.data;
};


export const getRequest = async (): Promise<any> => {
	try {
		const response = await mainClient.request("GET", "/api/request/getrequest");
		return response.data;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

export const deleteRequest = async (id: string): Promise<any> => {
	try {
		const response = await mainClient.request("DELETE", `/api/request/deleterequest/${id}`);
		return response;
		} catch (error) {
			console.error("Error deleting user:", error);
                throw error;
    }
}

export const previewRequestTemplate = async (requestId: string): Promise<Blob> => {
  try {
    const response = await mainClient.request("POST", "/api/request/previewRequest", {
      responseType: "blob",
      data: { requestId },
    });
    if (response.status === 200) {
      return new Blob([response.data], { type: "application/pdf" });
    }
    throw new Error('Failed to download template.');
  } catch (error) {
    console.error("Error downloading template:", error);
    throw error;
  }
};

export const generateRequest = async (requestId: string): Promise<any> => {
	  try {
	const response = await mainClient.request("POST", "/api/request/generateRequest", {
	  data: { requestId },
	});
	return response;
  } catch (error) {
	console.error("Error generating request:", error);
	throw error;
  }
}