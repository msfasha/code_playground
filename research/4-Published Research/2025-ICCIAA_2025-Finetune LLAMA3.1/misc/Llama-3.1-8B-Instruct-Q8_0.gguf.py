



from llama_cpp import Llama

llm = Llama.from_pretrained(
	repo_id="lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF",
	filename="Meta-Llama-3.1-8B-Instruct-IQ4_XS.gguf",
)

# llm.create_chat_completion(
# 	messages = [
# 		{
# 			"role": "user",
# 			"content": "What is the capital of France?"
# 		}
# 	]
# )

# # Download the model to a local path
# model_path = hf_hub_download(repo_id=repo_id, filename=filename)

# print(f"Model downloaded to: {model_path}")
