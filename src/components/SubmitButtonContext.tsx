import { createContext, ReactNode, useState } from "react";

export const SubmitButtonContext = createContext<any>([]);

// Provider in your app

export const SubmitButtonProvider = ({ children }: { children: ReactNode }) => {
	const [func, setFunc] = useState<()=>void>(()=>{});
	return <SubmitButtonContext.Provider value={[func, setFunc]}>{children}</SubmitButtonContext.Provider>;
};

