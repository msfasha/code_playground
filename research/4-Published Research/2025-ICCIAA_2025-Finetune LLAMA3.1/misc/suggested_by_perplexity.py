import torch
from transformers import LlamaForCausalLM, LlamaTokenizer, Trainer, TrainingArguments
from datasets import load_dataset

# Load the pre-trained LLaMA 3.1 model and tokenizer
model_name = "meta-llama/Llama-3-1"  # Adjust based on the actual model path
tokenizer = LlamaTokenizer.from_pretrained(model_name)
model = LlamaForCausalLM.from_pretrained(model_name)

# Load your custom dataset
# Replace 'your_dataset' with the path to your dataset or a dataset identifier from Hugging Face
dataset = load_dataset('your_dataset')

# Tokenize the dataset
def tokenize_function(examples):
    return tokenizer(examples['text'], padding="max_length", truncation=True)

tokenized_datasets = dataset.map(tokenize_function, batched=True)

# Set training arguments
training_args = TrainingArguments(
    output_dir="./llama3_continued_pretaining",
    evaluation_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=4,
    per_device_eval_batch_size=4,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir='./logs',
)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets['train'],
    eval_dataset=tokenized_datasets['validation'],
)

# Start continued pretraining
trainer.train()

# Save the model after training
trainer.save_model("./llama3_continued_pretraining")