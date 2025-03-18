import AnalogClock from '../components/AnalogClock';
import ActivityImage from '../components/ActivityImage';

export default function Home() {
  return (
    <main className="flex min-h-screen">
      {/* Bagian Kiri: Jam Analog */}
      <div className="w-1/2 h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center p-8">
        <AnalogClock />
      </div>
      
      {/* Bagian Kanan: Gambar dan Quotes */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <ActivityImage />
      </div>
    </main>
  );
}