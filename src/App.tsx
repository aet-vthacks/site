import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import NavBar from "components/NavBar";
import AccountPage from "pages/AccountPage";
import HomePage from "pages/HomePage";
import LearnPage from "pages/LearnPage";
import LoginPage from "pages/LoginPage";
import PetPage from "pages/PetPage";
import SignupPage from "pages/SignupPage";
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
				<NavBar>
					<Routes>
						<Route path="/signup" element={<SignupPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/account" element={<AccountPage />} />
						<Route path="/learn" element={<LearnPage />} />
						<Route path="/pet" element={<PetPage />} />
						<Route path="/" element={<HomePage />} />
					</Routes>
				</NavBar>
			</BrowserRouter>
		</ChakraProvider>
	);
}
