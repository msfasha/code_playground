# I was struggling to download a ggml model weights so I experimented with this code
# Does not work with ggml, works with Transfomers based models only


from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "TheBloke/Llama-2-7B-Chat-GGML"
# model_name = "https://huggingface.co/TheBloke/WizardLM-13B-V1.2-GPTQ"
# model_name = "https://huggingface.co/TheBloke/OpenAssistant-Llama2-13B-Orca-8K-3319-GGML"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

model = AutoModelForCausalLM.from_pretrained(model_name, hf_hub_url="https://huggingface.co")
tokenizer = AutoTokenizer.from_pretrained(model_name, hf_hub_url="https://huggingface.co")


# Save the model and tokenizer to a directory
output_dir = "llama_model"
model.save_pretrained(output_dir)
tokenizer.save_pretrained(output_dir)
