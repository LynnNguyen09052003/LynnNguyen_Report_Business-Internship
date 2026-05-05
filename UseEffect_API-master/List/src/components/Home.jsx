import { useNavigate } from 'react-router-dom';
import ProductTable from './ProductTable';

function App() {
  const navigate = useNavigate(); 

  const handleExit = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 gap-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-4 sm:p-6">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-center">Bảng Giá Sản Phẩm</h1>
        <ProductTable />
        <button
          onClick={handleExit}
          className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-yellow-900 transition"
        >
          Thoát
        </button>
      </div>
    </div>
  );
}

export default App;
