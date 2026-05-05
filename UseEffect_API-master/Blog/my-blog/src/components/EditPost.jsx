import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [removeImage, setRemoveImage] = useState(false);  

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

  const deleteImageFromServer = async (url) => {
  try {
    const filename = url.split('/').pop(); 
    const res = await fetch(`http://localhost:5000/delete-image?filename=${filename}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Lỗi xóa ảnh từ server');
    console.log('Đã xóa ảnh khỏi server');
  } catch (err) {
    console.error('❌ Không thể xóa ảnh:', err);
  }
};


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setContent(data.content);
          if (data.imageUrl) {
            setPreviewUrl(data.imageUrl);
            setOriginalImageUrl(data.imageUrl); 
          }
        } else {
          setMessage('❌ Bài viết không tồn tại.');
        }
      } catch (err) {
        setMessage('❌ Lỗi khi tải bài viết: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveImage(false); 
    }
  };

  const handleRemoveImage = async () => {
  if (originalImageUrl) {
    await deleteImageFromServer(originalImageUrl);
  }
  setImageFile(null);
  setPreviewUrl('');
  setRemoveImage(true);
};


const handleUpdate = async (e) => {
  e.preventDefault();
  if (!title || !content) {
    setMessage('⚠️ Vui lòng nhập tiêu đề và nội dung.');
    return;
  }

  try {
    setMessage('Đang cập nhật...');
    let imageUrl = originalImageUrl;

    if (removeImage) {
      if (originalImageUrl) {
        await deleteImageFromServer(originalImageUrl); // ✅ Xóa ảnh thật
      }
      imageUrl = '';
    } else if (imageFile) {
      imageUrl = await uploadImage(imageFile); 
    }

    await updateDoc(doc(db, 'posts', id), {
      title,
      content,
      imageUrl,
    });

    setMessage('✅ Cập nhật thành công!');
    setTimeout(() => navigate('/posts'), 1000);
  } catch (error) {
    setMessage('❌ Lỗi cập nhật: ' + error.message);
  }
};


  if (loading) {
    return (
      <div className="text-center py-10 text-xl text-gray-500">Đang tải bài viết...</div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto bg-teal-50 shadow rounded-lg mt-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-4">📝 Sửa bài viết</h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded text-base w-full"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 rounded text-base w-full"
          placeholder="Nội dung"
          rows="6"
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
            <div className="relative mt-4">
              <img
                src={previewUrl}
                alt="Ảnh xem trước"
                className="w-full max-h-64 object-cover rounded border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                Xóa ảnh
              </button>
            </div>
          )}
        </div>

        {message && (
          <p className={`text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded w-fit self-end">
          Cập nhật
        </button>
      </form>
    </div>
  );
}

export default EditPost;
