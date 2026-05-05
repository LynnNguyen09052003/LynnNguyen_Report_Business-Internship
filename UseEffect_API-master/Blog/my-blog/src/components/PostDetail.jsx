import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('❌ Không tìm thấy bài viết');
          navigate('/');
        }
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) return <div className="p-4 text-center text-lg">Đang tải bài viết...</div>;

  if (!post) return <div className="p-4 text-center text-lg text-red-500">Không tìm thấy bài viết</div>;

  return (
    <div className="px-4 py-6 sm:px-6 md:px-10 lg:px-20 xl:px-40 bg-teal-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-4 text-center sm:text-left">
          📰 {post.title}
        </h1>

        {post.imageUrl && (
          <div className="w-full mb-4">
            <img
              src={post.imageUrl}
              alt="Ảnh bài viết"
              className="w-full max-h-[400px] sm:max-h-[500px] object-contain rounded-lg shadow-md"
            />
          </div>
        )}

        <p className="text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-line break-words">
          {post.content}
        </p>

        <div className="mt-8 flex justify-center sm:justify-end">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow-sm"
          >
            🔙 Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
