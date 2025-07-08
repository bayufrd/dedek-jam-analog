'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ActivityImage() {
  const [currentImage, setCurrentImage] = useState('');
  const [activityText, setActivityText] = useState('');
  const [activityType, setActivityType] = useState('working');
  const [quote, setQuote] = useState('Waktu adalah emas');
  const [translatedQuote, setTranslatedQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [fadeState, setFadeState] = useState('in'); // 'in' atau 'out'

  // Fetch quote from the API
  const fetchQuote = async () => {
    try {
      setFadeState('out');

      setTimeout(async () => {
        try {
          const response = await fetch('/api/quote');

          if (!response.ok) {
            throw new Error(`Failed to fetch quote: ${response.statusText}`);
          }

          const data = await response.json();

          // Log the fetched data to inspect
          console.log('Fetched data:', data);

          // Update the quote and author state
          if (data && data.quote && data.author) {
            setQuote(data.quote); // Update quote state
            setAuthor(data.author); // Update author state
            
            // Set translated quote if available
            if (data.translatedQuote) {
              setTranslatedQuote(data.translatedQuote);
            }
          } else {
            throw new Error('No valid quote or author in the response');
          }
        } catch (error) {
          console.error('Error fetching quote:', error);

          // Set fallback quote and author if there's an error
          setQuote('Manfaatkan waktumu dengan bijak, karena waktu tidak pernah menunggu siapapun.');
          setAuthor('Mamas');
          setTranslatedQuote(''); // Clear translation on error
        } finally {
          setFadeState('in');
        }
      }, 500);
    } catch (error) {
      console.error('Error in fetch quote flow:', error);
      setFadeState('in');
    }
  };

  useEffect(() => {
    const updateImage = () => {
      const now = new Date();
      const hour = now.getHours();

      let imageSrc = '';
      let activity = '';
      let type = '';

      if (hour >= 22 && hour < 6) {
        imageSrc = '/dataPics/dedekSleeping.svg';
        activity = 'Dedek Sedang tidur';
        type = 'sleeping';
      } else if (hour >= 6 && hour < 9) {
        imageSrc = '/dataPics/dedekCooking.svg';
        activity = 'Dedek Sedang memasak';
        type = 'cooking';
      } else if (hour >= 9 && hour < 13) {
        imageSrc = '/dataPics/dedekWorking.svg';
        activity = 'Dedek Sedang bekerja';
        type = 'working';
      }  else if (hour >= 13 && hour < 14) {
        imageSrc = '/dataPics/dedekBreak.svg';
        activity = 'Dedek Sedang Istirahat';
        type = 'working';
      } else if (hour >= 14 && hour < 17) {
        imageSrc = '/dataPics/dedekWorking.svg';
        activity = 'Dedek Sedang bekerja';
        type = 'working';
      }else {
        imageSrc = '/dataPics/dedekPlaying.svg';
        activity = 'Dedek Sedang bermain bersama Momo dan Mamay';
        type = 'playing';
      }

      setCurrentImage(imageSrc);
      setActivityText(activity);

      if (type !== activityType) {
        setActivityType(type);
      }
    };

    updateImage();
    fetchQuote();

    const imageInterval = setInterval(updateImage, 60000); // Update every 1 minute
    const quoteInterval = setInterval(fetchQuote, 360000); // Update every 1 hour

    return () => {
      clearInterval(imageInterval);
      clearInterval(quoteInterval);
    };
  }, [activityType]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center md:space-x-6">
      {/* Image Section */}
      <div className="relative w-full md:w-[300px] h-[300px] mb-4 md:mb-0 overflow-hidden rounded-lg shadow-lg">
        {currentImage && (
          <Image
            src={currentImage}
            alt="Activity Image"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Text Section */}
      <div className="text-center md:text-left">
        <p className="text-xl font-medium text-pink-700 mb-6">{activityText}</p>
        <div className="max-w-md px-4">
          <h2 className="text-2xl font-bold mb-2 text-pink-600">Inspirasi Hari Ini dari Mamas</h2>
          <div
            className={`transition-opacity duration-500 ease-in-out ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}
          >
            <p className="text-lg text-gray-700 italic mb-2">"{quote}"</p>
            {/* Tampilkan terjemahan jika tersedia */}
            {translatedQuote && (
              <p className="text-md text-gray-600 italic mb-2">Terjemahan: <br/>"{translatedQuote}"</p>
            )}
            {author && <p className="text-sm text-gray-500">- {author}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Memfetch data dengan getStaticProps
export async function getStaticProps() {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();

    let translatedQuote = '';
    if (Array.isArray(data) && data.length > 0 && data[0].q && data[0].a) {
      const quote = data[0].q;
      const author = data[0].a;

      // Terjemahkan menggunakan MyMemory API
      const encodedText = encodeURIComponent(quote);
      const translationUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|id`;

      const translationResponse = await fetch(translationUrl);
      const translationData = await translationResponse.json();

      if (translationData && translationData.responseData && translationData.responseData.translatedText) {
        translatedQuote = translationData.responseData.translatedText;
      }

      return {
        props: {
          quote: quote,
          author: author,
          translatedQuote: translatedQuote,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
    // Fallback jika error
    return {
      props: {
        quote: "Manfaatkan waktumu dengan bijak, karena waktu tidak pernah menunggu siapapun.",
        author: "Mamas",
        translatedQuote: "",
      },
    };
  }

  return { props: { quote: "", author: "", translatedQuote: "" } };
}