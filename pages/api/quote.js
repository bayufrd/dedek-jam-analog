export default async function handler(req, res) {
  try {
    // Ambil quote dari zenquotes
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();

    console.log('Fetched data from zenquotes:', data);

    if (Array.isArray(data) && data.length > 0 && data[0].q && data[0].a) {
      const quote = data[0].q;
      const author = data[0].a;
      
      // Coba terjemahkan quote menggunakan API MyMemory
      let translatedQuote = '';
      try {
        const encodedText = encodeURIComponent(quote);
        const translationUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|id`;
        
        const translationResponse = await fetch(translationUrl, { timeout: 5000 });
        const translationData = await translationResponse.json();
        
        if (translationData && translationData.responseData && translationData.responseData.translatedText) {
          translatedQuote = translationData.responseData.translatedText;
        }
      } catch (translateError) {
        console.error("Error translating quote:", translateError);
        // Jika gagal, biarkan translatedQuote kosong
      }
      
      res.status(200).json({
        quote,
        author,
        translatedQuote
      });
    } else {
      console.error("Invalid response structure:", data);
      res.status(500).json({ error: "Invalid response format from ZenQuotes API" });
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({
      quote: "Manfaatkan waktumu dengan bijak, karena waktu tidak pernah menunggu siapapun.",
      author: "Mamas",
      translatedQuote: ""
    });
  }
}