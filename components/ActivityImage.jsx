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

  // Fungsi untuk mendapatkan quotes dari API gratis
  const fetchQuote = async () => {
    try {
      // Mulai transisi fade out
      setFadeState('out');
      
      // Tunggu fade out selesai
      setTimeout(async () => {
        try {
          // Gunakan API type.fit yang gratis dan tidak memerlukan token
          const response = await fetch('https://type.fit/api/quotes');
          
          if (!response.ok) throw new Error('API error');
          
          const quotes = await response.json();
          
          if (quotes && quotes.length > 0) {
            // Pilih quote secara random
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setQuote(randomQuote.text);
            setAuthor(randomQuote.author?.replace(', type.fit', '') || "Mamas");
          } else {
            throw new Error('No quotes found');
          }
        } catch (error) {
          console.error('Error fetching quote:', error);
          // Fallback quotes jika API gagal
          setQuote("Manfaatkan waktumu dengan bijak, karena waktu tidak pernah menunggu siapapun.");
          setAuthor("Mamas");
        } finally {
          // Mulai transisi fade in
          setFadeState('in');
        }
      }, 500); // Waktu fade out
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
      
      // Logika untuk menentukan gambar dan aktivitas berdasarkan waktu
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
      
      // Perbarui tipe aktivitas
      if (type !== activityType) {
        setActivityType(type);
      }
    };
    
    // Update gambar saat pertama kali komponen dimuat
    updateImage();
    
    // Ambil quote pertama kali
    fetchQuote();
    
    // Update gambar setiap menit
    const imageInterval = setInterval(updateImage, 60000);
    
    // Refresh quotes setiap 5 detik
    const quoteInterval = setInterval(fetchQuote, 5000);
    
    return () => {
      clearInterval(imageInterval);
      clearInterval(quoteInterval);
    };
  }, [activityType]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[300px] mb-4 overflow-hidden rounded-lg shadow-lg">
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
      <p className="text-xl font-medium text-pink-700 mb-6">{activityText}</p>
      
      {/* Quote section dengan animasi */}
      <div className="max-w-md text-center px-4">
        <h2 className="text-2xl font-bold mb-2 text-pink-600">Inspirasi Hari Ini</h2>
        <div 
          className={`transition-opacity duration-500 ease-in-out ${
            fadeState === 'in' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-lg text-gray-700 italic mb-2">"{quote}"</p>
          {author && <p className="text-sm text-gray-500">- {author}</p>}
        </div>
      </div>
    </div>
  );
}