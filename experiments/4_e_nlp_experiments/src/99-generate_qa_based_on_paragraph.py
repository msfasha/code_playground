import openai
import os

# Initialize the OpenAI API with your key
openai.api_key = os.environ["OPENAI_API_MOHD_FASHA_KEY"]

# This is a test file that can be used to test Openai API limits in terms of token limits
def generate_qa_dataset(context, num_pairs=2):
    """Generate Q&A dataset using OpenAI's GPT-3 or GPT-4."""
    prompt = f"Generate {num_pairs} question-answer pairs in Arabic based on the following Arabic context:\n\n{context}\n"
    
    response = openai.Completion.create(
        engine="text-davinci-003",  # Use "davinci" or another available engine
        prompt=prompt,
        max_tokens=500,  # Adjust as needed
        n=num_pairs,
        stop=None,
        temperature=0.7
    )
    
    # Extract Q&A pairs
    dataset = []
    for item in response.choices:
        lines = item.text.strip().split('\n')
        # if len(lines) == 2:
        #     dataset.append({
        #         "question": lines[0],
        #         "answer": lines[1]
        #     })
        [print(line) for line in lines]
    return dataset

# Test the function
# context = """
# The Earth revolves around the Sun in 365.25 days, which is why we have a leap year every four years. The process of photosynthesis in plants converts carbon dioxide into oxygen, making plants vital for life.
# """

context = """ﻗﺎﻧﻮﻥ ﺍﻟﻌﻘﻮﺑﺎﺕ ﺭﻗﻢ 16 1960/ ﻭﺟﻤﻴﻊ ﺗﻌﺪﻳﻼﺗﻪ ﻭﺍﻟﻤﻨﺸﻮﺭ ﻓﻲ ﺍﻟﺠﺮﻳﺪﺓ ﺍﻟﺮﺳﻤﻴﺔ ﺭﻗﻢ 1487 ﺗﺎﺭﻳﺦ 1960/1/1 ﻭﺍﻟﻤﻌﺪﻝ ﺑﺂﺧﺮ ﻗﺎﻧﻮﻥ ﺭﻗﻢ 2011/8 ﻭﺍﻟﻤﻨﺸﻮﺭ ﻓﻲ ﺍﻟﺠﺮﻳﺪﺓ ﺍﻟﺮﺳﻤﻴﺔ ﺭﻗﻢ 5090 ﺗﺎﺭﻳﺦ 2011/5/2.

ﺍﻟﻤﺎﺩﺓ (1)
ﻳﺴﻤﻰ ﻫﺬﺍ ﺍﻟﻘﺎﻧﻮﻥ (ﻗﺎﻧﻮﻥ ﺍﻟﻌﻘﻮﺑﺎﺕ ﻟﺴﻨﺔ 1960) ﻭﻳﻌﻤﻞ ﺑﻪ ﺑﻌﺪ ﻣﺮﻭﺭ ﺷﻬﺮ ﻋﻠﻰ ﻧﺸﺮﻩ ﻓﻲ ﺍﻟﺠﺮﻳﺪﺓ ﺍﻟﺮﺳﻤﻴﺔ.

ﺍﻟﻤﺎﺩﺓ (2) ﻳﻜﻮﻥ ﻟﻠﻌﺒﺎﺭﺍﺕ ﻭﺍﻻﻟﻔﺎﻅ ﺍﻟﺘﺎﻟﻴﺔ ﺍﻟﻮﺍﺭﺩﺓ ﻓﻲ ﻫﺬﺍ ﺍﻟﻘﺎﻧﻮﻥ ﺍﻟﻤﻌﺎﻧﻲ ﺍﻟﻤﺨﺼﺼﺔ ﻟﻬﺎ ﺃﺩﻧﺎﻩ ﺍﻻ ﺍﺫﺍ ﺩﻟﺖ ﺍﻟﻘﺮﻳﻨﺔ ﻋﻠﻰ ﺧﻼﻑ ﺫﻟﻚ:
ﺗﻌﻨﻲ ﻟﻔﻈﺔ (ﺍﻟﻤﻤﻠﻜﺔ): ﺍﻟﻤﻤﻠﻜﺔ ﺍﻻﺭﺩﻧﻴﺔ ﺍﻟﻬﺎﺷﻤﻴﺔ. ﻭﺗﺸﻤﻞ ﻋﺒﺎﺭﺓ (ﺍﻻﺟﺮﺍءﺍﺕ ﺍﻟﻘﻀﺎﺋﻴﺔ :) ﻛﺎﻓﺔ ﺍﻻﺟﺮﺍءﺍﺕ ﺍﻟﺘﻲ ﺗﺘﺨﺬ ﺃﻣﺎﻡ ﺃﻳﺔ ﻣﺤﻜﻤﺔ ﺃﻭ ﻣﺪﻋﻲ ﻋﺎﻡ ﺃﻭ ﻣﺠﻠﺲ ﻗﻀﺎﺋﻲ، ﺍﻭ ﻟﺠﻨﺔ ﺗﺤﻘﻴﻖ ﺃﻭ ﺷﺨﺺ ﻳﺠﻮﺯ ﺍﺩﺍء ﺍﻟﺸﻬﺎﺩﺓ ﺃﻣﺎﻣﻬﺎ ﺃﻭ ﺃﻣﺎﻣﻪ ﺑﻌﺪ ﺣﻠﻒ ﺍﻟﻴﻤﻴﻦ ﺳﻮﺍء ﻗﺎﻣﺖ ﻫﺬﻩ ﺍﻟﻤﺤﻜﻤﺔ ﺍﻭ ﺍﻟﻤﺠﻠﺲ ﺍﻟﻘﻀﺎﺋﻲ ﺃﻭ ﺍﻟﻠﺠﻨﺔ ﺃﻭ ﺫﻟﻚ ﺍﻟﺸﺨﺺ ﺑﺴﻤﺎﻉ ﺍﻟﺸﻬﺎﺩﺓ ﺑﻌﺪ ﺍﻟﻴﻤﻴﻦ ﺃﻭ ﺑﺪﻭﻥ ﺍﻟﻴﻤﻴﻦ. ﻭﺗﻌﻨﻲ ﻋﺒﺎﺭﺓ (ﺑﻴﺖ ﺍﻟﺴﻜﻦ:) ﺍﻟﻤﺤﻞ ﺍﻟﻤﺨﺼﺺ ﻟﻠﺴﻜﻨﻰ ﺃﻭ ﺃﻱ ﻗﺴﻢ ﻣﻦ ﺑﻨﺎﻳﺔ ﺍﺗﺨﺬﻩ ﺍﻟﻤﺎﻟﻚ ﺃﻭ ﺍﻟﺴﺎﻛﻦ ﺍﺫ ﺫﺍﻙ ﻣﺴﻜﻨﺎً ﻟﻪ ﻭﻟﻌﺎﺋﻠﺘﻪ ﻭﺿﻴﻮﻓﻪ ﻭﺧﺪﻣﻪ ﺃﻭ ﻷﻱ ﻣﻨﻬﻢ ﻭﺍﻥ ﻟﻢ ﻳﻜﻦ ﻣﺴﻜﻮﻧﺎً ﺑﺎﻟﻔﻌﻞ ﻭﻗﺖ ﺍﺭﺗﻜﺎﺏ ﺍﻟﺠﺮﻳﻤﺔ ، ﻭﺗﺸﻤﻞﺍﻳﻀﺎً ﺗﻮﺍﺑﻌﻪ ﻭﻣﻠﺤﻘﺎﺗﻪ ﺍﻟﻤﺘﺼﻠﺔ ﺍﻟﺘﻲ ﻳﻀﻤﻬﺎ ﻣﻌﻪ ﺳﻮﺭ ﻭﺍﺣﺪ. 
ﻭﺗﺸﻤﻞ ﻋﺒﺎﺭﺓ (ﺍﻟﻄﺮﻳﻖ ﺍﻟﻌﺎﻡ :) ﻛﻞ ﻁﺮﻳﻖ ﻳﺒﺎﺡ ﻟﻠﺠﻤﻬﻮﺭ ﺍﻟﻤﺮﻭﺭ ﺑﻪ ﻓﻲ ﻛﻞ ﻭﻗﺖ ﻭﺑﻐﻴﺮ ﻗﻴﺪ ﻓﻴﺪﺧﻞ ﻓﻲ ﻫﺬﺍ ﺍﻟﺘﻌﺮﻳﻒ ﺍﻟﺠﺴﻮﺭ ﻭﻛﺎﻓﺔ ﺍﻟﻄﺮﻕ ﺍﻟﺘﻲ ﺗﺼﻞ ﺍﻟﻤﺪﻥ ﺃﻭ ﺍﻟﺒﻼﺩ ﺑﻌﻀﻬﺎ ﺑﺒﻌﺾ ﻭﻻ ﻳﺪﺧﻞ ﻓﻴﻪ ﺍﻻﺳﻮﺍﻕ ﻭﺍﻟﻤﻴﺎﺩﻳﻦ ﻭﺍﻟﺴﺎﺣﺎﺕ ﻭﺍﻟﺸﻮﺍﺭﻉ ﺍﻟﻜﺎﺋﻨﺔ ﺩﺍﺧﻞ ﺍﻟﻤﺪﻥ ﺃﻭ ﺍﻟﺒﻠﺪﺍﻥ ﺃﻭ ﺍﻟﻘﺮﻯ ﻭﺍﻻﻧﻬﺎﺭ. 
ﻭﺗﺸﻤﻞ ﻋﺒﺎﺭﺓ (ﻣﻜﺎﻥ ﻋﺎﻡ ﺃﻭ ﻣﺤﻞ ﻋﺎﻡ :) ﻛﻞ ﻁﺮﻳﻖ ﻋﺎﻡ ﻭﻛﻞ ﻣﻜﺎﻥ ﺃﻭ ﻣﻤﺮ ﻳﺒﺎﺡ ﻟﻠﺠﻤﻬﻮﺭ ﺍﻟﻤﺮﻭﺭ ﺑﻪ ﺃﻭ ﺍﻟﺪﺧﻮﻝ ﺍﻟﻴﻪ ﻓﻲ ﻛﻞ ﻭﻗﺖ ﻭﺑﻐﻴﺮ ﻗﻴﺪ ﺃﻭ ﻛﺎﻥ ﻣﻘﻴﺪﺍً ﺑﺪﻓﻊ ﻣﺒﻠﻎ ﻣﻦ ﻟﻨﻘﻮﺩ ﻭﻛﻞ ﺑﻨﺎء ﺃﻭ ﻣﻜﺎﻥ ﻳﺴﺘﻌﻤﻞ ﺇﺫ ﺫﺍﻙ ﻷﻱ ﺍﺟﺘﻤﺎﻉ ﺃﻭ ﺣﻔﻞ ﻋﻤﻮﻣﻲ ﺃﻭ ﺩﻳﻨﻲ ﺃﻭ ﻛﺴﺎﺣﺔ ﻣﻜﺸﻮﻓﺔ.
ﻭﻳﻘﺼﺪ ﺑﻠﻔﻈﺘﻲ (ﺍﻟﻠﻴﻞ(ﺃﻭ)ﻟﻴﻼً:) ﺍﻟﻔﺘﺮﺓ ﺍﻟﺘﻲ ﺗﻘﻊ ﺑﻴﻦ ﻏﺮﻭﺏ ﺍﻟﺸﻤﺲ ﻭﺷﺮﻭﻗﻬﺎ. ﻭﻳﺮﺍﺩ ﺑﻠﻔﻈﺔ (ﺍﻟﺠﺮﺡ:) ﻛﻞ ﺷﺮﻁ ﺃﻭ ﻗﻄﻊ ﻳﺸﺮﻁ ﺃﻭ ﻳﺸﻖ ﻏﺸﺎء ﻣﻦ ﺃﻏﺸﻴﺔ ﺍﻟﺠﺴﻢ ﺍﻟﺨﺎﺭﺟﻴﺔ. ﻭﺍﻳﻔﺎء ﻟﻠﻐﺮﺽ ﻣﻦ ﻫﺬﺍ ﺍﻟﺘﻔﺴﻴﺮ ، ﻳﻌﺘﺒﺮ ﺍﻟﻐﺸﺎء ﺧﺎﺭﺟﻴﺎً ﺇﺫﺍ ﻛﺎﻥ ﻓﻲ ﺍﻻﻣﻜﺎﻥ ﻟﻤﺴﻪ ﺑﺪﻭﻥ ﺷﻄﺮ ﺃﻱ ﻏﺸﺎء ﺁﺧﺮ ﺃﻭ ﺷﻘﻪ."""


qa_dataset = generate_qa_dataset(context)
for pair in qa_dataset:
    print(f"Question: {pair['question']}\nAnswer: {pair['answer']}\n")






# context = context.replace('\r', '').replace('\n', '')

# custom_prompt=f"""Create a single short question and answer pair in Arabic language based on the context below,
# #### CONTEXT: {context} ####"""

# # Generate a question-answer pair using ChatGPT
# response = openai.Completion.create(
# engine="text-davinci-003",
# prompt=custom_prompt,
# max_tokens=1000,
# n=1,
# stop=None,
# temperature=.2
#     )

# # Access the "choices" list in the JSON response object and extract the text
# response_list = [choice["text"].strip().split('\n') for choice in response.choices]

# # Initialize an empty list to store dictionaries
# qa_pairs = []

# # Initialize variables to hold the current question and answer
# current_question = ""
# current_answer = ""

# for item in response_list:
#     item = [i for i in item if i != ""]  # remove empty lines
#     current_question = item[0]
#     current_answer = item[1]
#     qa_pairs.append({"question": current_question, "answer": current_answer})


# print(qa_pairs)



