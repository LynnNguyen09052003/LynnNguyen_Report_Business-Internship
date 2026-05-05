import React, { useEffect, useState } from 'react'
import axios from 'axios'


const ProductTable = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newProduct, setNewProduct] = useState({ name: '', price: '' })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/products')
        setProducts(res.data)
      } catch (err) {
        setError(err.message || 'Lỗi khi lấy dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

const handleAddProduct = async () => {
  if (!newProduct.name || !newProduct.price) return;

  try {
    const res = await axios.post('http://localhost:3000/api/products', {
      name: newProduct.name,
      price: newProduct.price
    });

    setProducts([...products, res.data]);
    setNewProduct({ name: '', price: '' });

    console.log('✅ Đã thêm sản phẩm:', res.data);
  } catch (err) {
    console.error('❌ Lỗi khi gửi API:', err);
  }
};
const handleDelete = async (id) => {
  if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

  try {
    await axios.delete(`http://localhost:3000/api/products/${id}`);
    setProducts(products.filter(p => p.id !== id));
  } catch (err) {
    console.error('❌ Lỗi khi xóa sản phẩm:', err);
  }
};

  if (loading) return <p className="text-center">Đang tải...</p>
  if (error) return <p className="text-red-500 text-center">{error}</p>

  return (
    <div className=" flex flex-col-reverse overflow-x-auto p-4 gap-4">
      <div className="mb-4 flex gap-4 flex-wrap items-end">
        <div>
          <label className="block mb-1">Tên sản phẩm</label>
          <input
            type="text"
            className="border rounded px-2 py-1 focus:border-sky-700"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1">Giá</label>
          <input
            type="number"
            className="border rounded px-2 py-1 focus:border-sky-500"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-800">
          Thêm
        </button>
      </div>

      <table className="border border-gray-300 rounded-lg shadow-md w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Thứ tự</th>
            <th className="px-4 py-2 text-center">Tên sản phẩm</th>
            <th className="px-4 py-2 text-right">Giá</th>
            <th className="px-4 py-2 text-center w-10"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-2 text-left">{index + 1}</td>
              <td className="px-4 py-2 text-center">{product.name}</td>
              <td className="px-4 py-2 text-right">{product.price.toFixed(3)}VND</td>
              <td className="px-4 py-2 text-center">
              <button
              onClick={() => handleDelete(product.id)}
              className="text-red-500 text-xl font-bold hover:text-red-900"
              title="Xóa sản phẩm">×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
