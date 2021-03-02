
# Instruction
1. download the file <br/>
2. open terminal, and find the path to this project <br/>
`npm install bootstrap` <br/>
`npm install --save font-awesome` <br/>
`npm install xlsx` <br/>
`npm install recharts` <br/>
These are the packages that are installed for these project <br/>
`npm start` <br/>
## Project Summary
This is an informational retrieval project. Multiple key concepts are included in this project: indexing, tokenization, stemming, ranking, cosine-similarity, P@10, precision, recall, and MAP@10. And because using existing open-source package will ruin the purpose of this project, _all codes are self written_.

By default, when the page starts running, more than 1200 documents from [6 different XML files](./src/cfcFiles) have been parsed, tokenized, stemmed, and indexed. The values of each terms and doc are also calculated with the [ranking algorithm](https://janav.wordpress.com/2013/10/27/tf-idf-and-cosine-similarity/).

Then [100 queries](./src/queryFiles/cfquery.xml) are also indexed, tokenized, and stemmed. These queries are then used to test the ranking.  From the query xml file, we can actually find the expected result. Thus, we can easily compare the actual result with expected result.

## Basic Architecture/Design
**Homepage**: This is the main page where default functions will be called; such as parsing xml, tokenization, indexing. 

**UserInsertPage**: This is  the page where user can insert a query and the page will show the top ranked result

**Graphs**: The graphs here are the result of ranking, calculations of the 100 [default queries](./src/queryFiles/cfquery.xml).

## Indexing / Tokenization
One of the toughest issues in writting a self-made information retrieval system is stemming. English has many 'special' rules for present tense, past tense, plurals. This would be easy if we use an open library. but nope. not here. 

**Initial Thought**: Every word that we see, we check if it has 's' or 'ed' or 'ing' at the end (postfix), and if we have seen that word without the postfix, we simply just use that old one for indexing instead of the new one. However, this is an issue for words that are super rared. For instance, if the word, "apprentices" was read/parse/indexed first, and then its singular form "apprentice" will be stored as a different index. The result of this kind of tokenization can dramactically change the result of the ranking.

**Update Method**: If the word "apprentices" shows up before "apprentice", then when we see "apprentice", we just add it to the indexing of its plural form. Thus, after every word is tokenized, we run another function to see if this word has previously showed up in other form. Since we can't guarantee which 'form' (past tense, plural, adverb) will be indexed/tokenized first, we just need to reverse-tokenized to check if a word was already indexed in a different form before. 

## Improvements
Every time the page refreshes, all the calcuations will be re-do again; this might cause the ranking result slightly different everytime. Ideally, these functions should be stored somewhere in a server for use.