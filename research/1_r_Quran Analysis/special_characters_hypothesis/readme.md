## Quran Quantitative Analyses
#### Project Objectives
My objectives of this project is to analyse Quran text from a Quantative and Time Series perspective.

- I want to run multiple time series analyses, characters level, selected characters level, words level, surah level.
- I want also to run time series analysis over a number of Ayah e.g. every 10 Ayah see what is income or a noticable pattern.
- I to look into these alphabets that starts some surah e.g. {alif, lam, mem}, {Kaf}, {Kaaf, Haa, Ein, Saad}...etc, I suspect these letters are serving some kind of CRC check to validate the preior sequence.
- A challenge of mine would be wether to include diacretes or not, or may be try both. ALso there are some debated wordings or spellings that might infleunce the counting process.
For the purpose of Time Series creation, I might use:
    - The unicode representation of the character, just a unique ID for it.
    - A number according to its order (does that make any difference than above)
    - Some number related to the special characters (Alif, Lam, Meem...etc), or even work with these letters only in the text and see if they exibit some pattern?
    - What order of Ayat should I use, mushaf order vs. chronological (revelation)
    - We might use the number of characters as a value for the time series
    - We might use the number of characters with diacritic as a value for the time series
    - We might use the number of words as a value for the time series
    - We might look for a pattern within the same aya, or within a number of ayat.

I need a clean and a trusted version of Quran text:
I found some datasets at site:
https://tanzil.net/download/
May be there are other sites.
