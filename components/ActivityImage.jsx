'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ActivityImage() {
  const [currentImage, setCurrentImage] = useState('');
  const [activityText, setActivityText] = useState('');
  const [activityType, setActivityType] = useState('working');
  const [quote, setQuote] = useState('Waktu adalah emas');
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
          } else {
            throw new Error('No valid quote or author in the response');
          }
        } catch (error) {
          console.error('Error fetching quote:', error);

          // Set fallback quote and author if there's an error
          setQuote('Manfaatkan waktumu dengan bijak, karena waktu tidak pernah menunggu siapapun.');
          setAuthor('Mamas');
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

      if (hour >= 0 && hour < 8) {
        imageSrc = '/dataPics/dedekSleeping.jpg';
        activity = 'Dedek Sedang tidur';
        type = 'sleeping';
      } else if (hour >= 8 && hour < 16) {
        imageSrc = '/dataPics/dedekWorking.jpg';
        activity = 'Dedek Sedang bekerja';
        type = 'working';
      } else if (hour >= 16 && hour < 18) {
        imageSrc = '/dataPics/dedekCooking.jpg';
        activity = 'Dedek Sedang memasak';
        type = 'cooking';
      } else {
        imageSrc = '/dataPics/dedekPlaying.jpg';
        activity = 'Dedek Sedang bermain';
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
    const quoteInterval = setInterval(fetchQuote, 15000); // Update every 1 hour

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
            {author && <p className="text-sm text-gray-500">- {author}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
