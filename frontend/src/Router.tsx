import { Route, Navigate, Routes } from "react-router";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectRoute";
import RedirectByRole from "./components/RedirectByRole/index.tsx";
import RoleProtectedRoute from "./components/RoleProtectedRoute.tsx/index.tsx";
import { roles } from "./libs/constants.ts";
import { Admin } from "./pages/Admin.tsx";
import { Requests } from "./pages/Request.tsx";
import { RequestDetail } from "./pages/RequestDetail.tsx";
import { DocumentPreview } from "./pages/DocumentPreview.tsx";
import { ReportPage } from "./pages/ReportPage.tsx";


export function Router() {
	return (
		// <Routes>

		// 	<Route path="/login" element={<Login />} />
		// 	<Route path="/" element={<Dashboard />}>

		// 		<Route path="" element={<Navigate to="/dashboard" />} />
		// 		<Route path="/dashboard" element={<ProtectedRoute />}>
		// 			<Route path="">
		// 				<Route index element={<RedirectByRole />} />
		// 				<Route
		// 					element={
		// 						<RoleProtectedRoute
		// 							allowedRoles={[roles.user]}
		// 						/>
		// 					}
		// 				>
		// 					 <Route path="userrequest" element={<Requests />} />
		// 					 <Route
		// 						path="requestDetails/:id"
		// 						element={<RequestDetail />}
		// 					/>
		// 					{/* <Route path="requests" element={<Requests />} />
							
		// 					<Route path="signatures" element={<Signatures />} />
		// 					<Route
		// 						path="template/:id"
		// 						element={<TemplatPreview />} 
		// 					/>*/}
		// 				</Route>

		// 				<Route
		// 					element={<RoleProtectedRoute allowedRoles={[roles.admin]} />}
		// 				>
		// 				 <Route path="requests" element={<Requests />}/>
        //                  <Route path="admin" element={<Admin />} />
		// 				 <Route
		// 						path="requestDetails/:id"
		// 						element={<RequestDetail />}
		// 					/>
		// 					{/* <Route path="users" element={<Users />} /> */}
		// 					{/* <Route
		// 						path="court/:courtId"
		// 						element={<CourtUsers />}
		// 					/> */}
		// 				</Route>
		// 			</Route>
		// 		</Route>
		// 	</Route>
		// </Routes>
		<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<Dashboard />}>
    <Route index element={<Navigate to="/dashboard" />} />
    <Route path="/dashboard" element={<ProtectedRoute />}>
      <Route index element={<RedirectByRole />} />

      {/* Shared Route for both roles */}
      <Route path="requestDetails/:id" element={<RequestDetail />} />
	  <Route path="/dashboard/requestDetails/:requestId/document/:documentId" element={<DocumentPreview />} />
      <Route path="/dashboard/report/:requestId" element={<ReportPage />} />
      {/* User Role Routes */}
      <Route
        element={<RoleProtectedRoute allowedRoles={[roles.user]} />}
      >
        <Route path="userrequest" element={<Requests />} />
      </Route>

      {/* Admin Role Routes */}
      <Route
        element={<RoleProtectedRoute allowedRoles={[roles.admin]} />}
      >
        <Route path="requests" element={<Requests />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Route>
  </Route>
</Routes>

	);
}
