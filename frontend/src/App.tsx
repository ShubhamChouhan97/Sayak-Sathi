import { useCallback, useEffect, useState } from "react";
import { Spin } from "antd";
import { Router } from "./Router";
import { useAppStore } from "./store";
const App = () => {
	const init = useAppStore().init;
  const appLoading = useAppStore().appLoading;


  const [initalSessionRequst, setInitalSessionRequest] =
		useState<boolean>(false);
	const intialGetRequest = useCallback(async () => {
		try {
			await init();
		} catch (error) {
			console.error(error);
		} finally {
			setInitalSessionRequest(true);
		}
	}, [setInitalSessionRequest]);

	useEffect(() => {
		intialGetRequest();
	}, [intialGetRequest]);

	if (!initalSessionRequst) {
		return (
			<div className="flex justify-center items-center h-full w-full">
				<Spin size="large"></Spin>
			</div>
		);
	}

	return (
	 <Spin size="large" spinning={appLoading}>
				<Router />
		</Spin>
	);
};

export default App;
