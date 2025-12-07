#pip install gTTS
# This script uses the gTTS (Google Text-to-Speech) library to convert text to speech in Arabic.


from gtts import gTTS

text = "مرحبا، كيف حالك؟"
tts = gTTS(text=text, lang='ar')
tts.save("output.mp3")
