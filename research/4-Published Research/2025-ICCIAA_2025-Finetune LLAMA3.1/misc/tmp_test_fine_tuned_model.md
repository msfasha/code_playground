so now i have two models, the original llama3.1 and llama3.1 Ifurther trained/ contiuned pretrained using arabic wikipedia.

How can i determined if there is a difference in performance or if the performace enhanced by the continued training that i've performed

To determine whether the continued pretraining of your `llama3.1` model on Arabic Wikipedia has improved its performance compared to the original `llama3.1` model, you can follow these steps:

### 1. **Define a Task for Evaluation**
First, decide which tasks or metrics you're using to evaluate the model. This depends on the kind of tasks that `llama3.1` is designed for. Here are some common tasks and corresponding evaluations:
   
- **Language modeling task**: Evaluate perplexity or loss on a held-out dataset (e.g., an Arabic corpus).
- **Text generation task**: Evaluate BLEU score, ROUGE, or human-evaluated fluency and relevance.
- **Question answering task**: Evaluate accuracy, F1 score, or EM (Exact Match) score on an Arabic QA dataset.
- **Classification task**: Evaluate accuracy or F1-score on an Arabic text classification dataset.

If you plan to focus on language modeling, perplexity is often the most direct way to measure how well the model predicts a sequence of text.

### 2. **Collect an Evaluation Dataset**
You need an evaluation dataset that aligns with the task you want to assess. Since your model was trained on Arabic Wikipedia, it makes sense to use an Arabic-language dataset for evaluation. You can use:
   
- **Arabic Wikipedia** (a held-out portion not used in training).
- **Other Arabic corpora**: Datasets like [OSCAR](https://oscar-corpus.com/) or [Arabic Gigaword](https://catalog.ldc.upenn.edu/LDC2006T02).
- **Specific tasks**: Arabic QA (SQuAD in Arabic, TyDi QA), Arabic NER, Arabic text classification datasets.

### 3. **Evaluate the Original Model**
Run the original `llama3.1` model on your chosen evaluation dataset to establish a baseline.

#### Example (for language modeling):

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load the original model
model_original = AutoModelForCausalLM.from_pretrained('original_llama3.1_model')
tokenizer = AutoTokenizer.from_pretrained('original_llama3.1_model')

# Sample evaluation function for perplexity on a text dataset
def evaluate_perplexity(model, tokenizer, dataset):
    model.eval()
    total_loss = 0
    total_tokens = 0
    
    for text in dataset:  # Assume dataset is a list of texts
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512).to('cuda')
        with torch.no_grad():
            outputs = model(**inputs, labels=inputs.input_ids)
        loss = outputs.loss
        total_loss += loss.item() * inputs.input_ids.size(1)
        total_tokens += inputs.input_ids.size(1)
    
    perplexity = torch.exp(torch.tensor(total_loss / total_tokens))
    return perplexity

# Run evaluation
dataset = ["your Arabic texts here"]  # Replace with your actual dataset
perplexity_original = evaluate_perplexity(model_original, tokenizer, dataset)
print(f"Original model perplexity: {perplexity_original}")
```

### 4. **Evaluate the Fine-tuned Model**
Now, evaluate the fine-tuned model using the same dataset and task. This helps you compare results directly.

```python
# Load the fine-tuned model
model_finetuned = AutoModelForCausalLM.from_pretrained('finetuned_llama3.1_arabic_wikipedia')

# Evaluate on the same dataset
perplexity_finetuned = evaluate_perplexity(model_finetuned, tokenizer, dataset)
print(f"Fine-tuned model perplexity: {perplexity_finetuned}")
```

### 5. **Compare Results**
Once you have the results from both the original and fine-tuned models, compare the metrics (e.g., perplexity, accuracy, BLEU score, etc.).

- **Perplexity**: A lower perplexity indicates better language modeling performance.
- **Accuracy/F1/BLEU**: Higher values indicate better performance for classification or generation tasks.

For example:

```python
if perplexity_finetuned < perplexity_original:
    print("Fine-tuned model performs better.")
else:
    print("Original model performs better.")
```

### 6. **Perform Statistical Significance Tests (Optional)**
If the results from the two models are close, you might want to run statistical tests like a paired t-test to ensure the difference in performance is statistically significant.

### 7. **Manual Evaluation (Optional)**
For tasks like text generation, where quantitative metrics don't always capture the full picture, you can manually inspect the output quality of both models. Generate text samples or evaluate answers to questions, and assess the fluency, coherence, and relevance of the results.

#### Example:

```python
prompt = "اكتب فقرة عن الثورة الصناعية"
input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to('cuda')

# Generate with the original model
outputs_original = model_original.generate(input_ids, max_length=200)
print("Original Model Output: ", tokenizer.decode(outputs_original[0], skip_special_tokens=True))

# Generate with the fine-tuned model
outputs_finetuned = model_finetuned.generate(input_ids, max_length=200)
print("Fine-tuned Model Output: ", tokenizer.decode(outputs_finetuned[0], skip_special_tokens=True))
```

### 8. **Document and Analyze**
Document the results and analyze whether the fine-tuned model has improved in the task you're testing. If your continued training improved perplexity, accuracy, or other metrics, you can conclude that the fine-tuning on Arabic Wikipedia helped the model perform better on Arabic tasks.

### Summary Steps:

1. Define the task you want to evaluate (language modeling, text classification, etc.).
2. Collect an evaluation dataset relevant to your task.
3. Evaluate the original model to establish a baseline performance.
4. Evaluate the fine-tuned model.
5. Compare the results (e.g., perplexity, BLEU score, accuracy).
6. Optionally, perform manual evaluation and statistical significance tests.

Let me know if you need further clarification on any step!