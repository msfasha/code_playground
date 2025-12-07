# I was struggling to download a ggml model weights so I experimented with this code

model_name_or_path = "TheBloke/Llama-2-7B-Chat-GGML"
model_basename = "llama-2-7b-chat.ggmlv3.q5_1.bin" # the model is in bin format

from huggingface_hub import hf_hub_download
model_path = hf_hub_download(repo_id=model_name_or_path, filename=model_basename)