import AnalogClock from '../components/AnalogClock';
import ActivityImage from '../components/ActivityImage';

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {/* Bagian Kiri: Jam Analog */}
      <div className="w-full md:w-1/2 h-auto bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center p-4">
        <AnalogClock />
      </div>

      {/* Bagian Kanan: Gambar dan Quotes */}
      <div className="w-full md:w-1/2 h-auto flex flex-col items-center justify-center p-4 bg-white">
        <ActivityImage />
      </div>
    </main>
  );
}
