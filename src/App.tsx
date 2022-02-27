import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import NavBar from "components/NavBar";
import AccountPage from "pages/AccountPage";
import LearnOverviewPage from "pages/LearnOverviewPage";
import LearnPage from "pages/LearnPage";
import LoginPage from "pages/LoginPage";
import PetPage from "pages/PetPage";
import SignupPage from "pages/SignupPage";
import UnboxPage from "pages/UnboxPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";


export default function App() {
	return (
		<ChakraProvider theme={extendTheme({
			config: {
				initialColorMode: "light",
				useSystemColorMode: true
			}
		})}>
			<BrowserRouter>
				{/* <SubmitButtonProvider> */}
				<NavBar>
					<Routes>
						<Route path="/signup" element={<SignupPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/account" element={<AccountPage />} />
						<Route path="/learn/:id" element={<LearnPage />} />
						<Route path="/pet" element={<PetPage />} />
						<Route path="/unbox" element={<UnboxPage />} />
						<Route path="/" element={<LearnOverviewPage />} />
					</Routes>
				</NavBar>
				{/* </SubmitButtonProvider> */}
			</BrowserRouter>
		</ChakraProvider>
	);
}
