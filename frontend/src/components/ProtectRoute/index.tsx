import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
// Update the import path below if your store file is located elsewhere
import { useAppStore } from "../../store"; // e.g., change to "../store" or "../../../store" if needed

const ProtectedRoute: React.FC = () => {
	const session = useAppStore().session?.userId;
	const isAuthenticated = !!session;

	useEffect(() => {
		console.info(session);
	}, [session]);

	if (isAuthenticated === null) {
		return <div>Loading...</div>;
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
