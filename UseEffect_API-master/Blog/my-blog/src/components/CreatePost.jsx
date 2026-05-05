import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('')


  const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('http://localhost:5000/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Lỗi upload ảnh');

  const data = await response.json();
  return data.imageUrl; 
};

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !content) {
    setMessage('Vui lòng nhập tiêu đề và nội dung.');
    return;
  }

  try {
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await uploadImage(imageFile); // Gửi ảnh lên server Node.js
    }

    await addDoc(collection(db, 'posts'), {
      title,
      content,
      imageUrl,
      createdAt: Timestamp.now(),
    });

    setMessage('Đăng bài thành công!');
    setTimeout(() => navigate('/posts'), 1000);
  } catch (err) {
    setMessage('Lỗi: ' + err.message);
  }
};

  return (
    <div className="p-4 sm:p-6 bg-teal-50 shadow rounded-lg max-w-screen-md mx-auto mt-6">
      <h2 className="text-2xl sm:text-4xl text-green-500 font-bold mb-4">Tạo bài viết</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded w-full text-base sm:text-lg"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 rounded w-full text-base sm:text-lg"
          placeholder="Nội dung"
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 px-3 py-2 rounded w-full"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Xem trước ảnh"
              className="w-full max-h-64 sm:max-h-80 object-cover mt-4 rounded border"
            />
          )}
        </div>
        {message && <p className="text-red-500 text-sm">{message}</p>}
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-fit self-end cursor-pointer">
          Đăng bài
        </button>
      </form>
    </div>
  );
}

export default CreatePost;