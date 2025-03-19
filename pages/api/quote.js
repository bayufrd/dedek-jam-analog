export default async function handler(req, res) {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();

    console.log('Fetched data from zenquotes:', data);

    if (Array.isArray(data) && data.length > 0 && data[0].q && data[0].a) {
      res.status(200).json({
        quote: data[0].q, 
        author: data[0].a
      });
    } else {
      console.error("Invalid response structure:", data);
      res.status(500).json({ error: "Invalid response format from ZenQuotes API" });
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({
      quote: "Manfaatkan waktumu dengan bijak, karena waktu tidak pernah menunggu siapapun.",
      author: "Mamas"
    });
  }
}
