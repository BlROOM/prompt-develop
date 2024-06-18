import ChatBot from '@/components/ChatBot';
import Stock from '../components/StockForm';

export default async function Home() {
  return (
    <>
      <Stock />
      <ChatBot />
    </>
  );
}
