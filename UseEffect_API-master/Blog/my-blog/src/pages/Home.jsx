import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-teal-50 gap-6 p-6 shadow rounded-lg max-w-screen-lg mx-auto mt-6 text-center">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl text-green-500 font-bold">
        ✨ Chào mừng đến với Blog của mình!
      </h1>
      <p className="text-base sm:text-lg lg:text-2xl font-medium leading-relaxed text-gray-700">
        Nơi mình chia sẻ những kiến thức, kinh nghiệm và cảm hứng về lập trình, công nghệ và cuộc sống. 
        Mỗi bài viết là một hành trình nhỏ, ghi lại những gì mình học được và muốn chia sẻ lại cho cộng đồng.
      </p>
    </div>
  );
}

export default Home;
