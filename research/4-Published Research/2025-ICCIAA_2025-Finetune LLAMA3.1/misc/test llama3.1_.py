from transformers import AutoModelForCausalLM, AutoTokenizer

# Load the GPT4All model and tokenizer
model_name = "meta-llama/Meta-Llama-3.1-8B"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Set the context or prompt for text completion
prompt = "The quick brown fox jumps over the "

# Generate text completion
input_ids = tokenizer(prompt, return_tensors="pt").input_ids
generated_ids = model.generate(input_ids, max_length=50, num_return_sequences=1)

# Decode the generated text
generated_text = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]

# Print the result
print(f"Prompt: {prompt}")
print(f"Completion: {generated_text}")