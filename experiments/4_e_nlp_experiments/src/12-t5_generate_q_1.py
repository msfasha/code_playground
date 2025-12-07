# An interesting code that was found at:
# https://huggingface.co/MIIB-NLP/Arabic-question-generation

# This model is ready to use for Question Generation task, 
# simply enter a context with an answer, the model will generate a question, 
# This model is a fine-tuned version of AraT5-Base Model
# The test results at huggingface website was not promising


#Requirements: !pip install transformers
from transformers import AutoTokenizer,AutoModelForSeq2SeqLM

model = AutoModelForSeq2SeqLM.from_pretrained("MIIB-NLP/Arabic-question-generation")
tokenizer = AutoTokenizer.from_pretrained("MIIB-NLP/Arabic-question-generation")

def get_question(context,answer):
  text="context: " +context + " " + "answer: " + answer + " </s>"
  text_encoding = tokenizer.encode_plus(
      text,return_tensors="pt"
  )
  model.eval()
  generated_ids =  model.generate(
    input_ids=text_encoding['input_ids'],
    attention_mask=text_encoding['attention_mask'],
    max_length=64,
    num_beams=5,
    num_return_sequences=1
  )
  return tokenizer.decode(generated_ids[0],skip_special_tokens=True,clean_up_tokenization_spaces=True).replace('question: ',' ')

context="الثورة الجزائرية أو ثورة المليون شهيد، اندلعت في 1 نوفمبر 1954 ضد المستعمر الفرنسي ودامت 7 سنوات ونصف. استشهد فيها أكثر من مليون ونصف مليون جزائري"
answer =" 7 سنوات ونصف"

get_question(context,answer)

#output : question="كم استمرت الثورة الجزائرية؟ "
