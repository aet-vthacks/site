import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { z } from "zod";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleEmailChange = (e: any) => setEmail(e.target.value);
	const handlePasswordChange = (e: any) => setPassword(e.target.value);

	const isEmailValid = z.string()
		.email()
		.safeParse(email).success;

	const isFormValid = isEmailValid && email.length > 0 && password.length > 0;

	return (
		<Flex
			align={"center"}
			justify={"center"}
		>
			<Stack spacing={8} mx={"auto"} w={"lg"} p={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Welcome Back
					</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to get started with Learn.py 🐍
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}>
					<Stack spacing={4}>
						<FormControl id="email" isRequired>
							<FormLabel>Email address</FormLabel>
							<Input
								type="email"
								value={email}
								placeholder="john.doe@example.com"
								onChange={handleEmailChange}
								isInvalid={!isEmailValid}
							/>
						</FormControl>
						<FormControl id="password" isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={handlePasswordChange}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() =>
											setShowPassword((showPassword) => !showPassword)
										}>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText="Submitting"
								isDisabled={!isFormValid}
								size="lg"
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500"
								}}>
								Sign up
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Not signed up?
								{" "}
								<Link
									as={RouterLink}
									color={"blue.400"}
									to='/signup'
								>Sign Up</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
