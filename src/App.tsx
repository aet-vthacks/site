import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import NavBar from "components/NavBar";
import LoginPage from "pages/LoginPage";
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
					</Routes>
				</NavBar>
			</BrowserRouter>
		</ChakraProvider>
	);
}
