export const getArticle = (word) => {
    if (!word) return "";
  
    const startsWithVowel = /^[aeiouh]/.test(word);
    const needsArticle = word.length > 1;
  
    if (!needsArticle) return word;
  
    return startsWithVowel ? `d'${word}` : `des ${word}s`;
  };
  