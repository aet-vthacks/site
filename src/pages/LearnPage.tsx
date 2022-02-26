import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import { http } from "utils";


export default function LearnPage() {
	function handleEditorChange(value: string | undefined) {
		console.log("here is the current model value:", value);
	}

	const navigate = useNavigate();

	http.get("me")
		.then(res => {
			if (res.status !== 200) {
				navigate("/login");
			}
		})
		.catch(() => navigate("/login"));

	return (
		<Editor
			width="60vw"
			height="65vh"
			defaultLanguage="python"
			defaultValue="# some comment"
			onChange={handleEditorChange}
		/>
	);
}
