// Firebase/deletePost.js
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const deleteImageFromServer = async(imageUrl) => {
    if (!imageUrl) return;
    const filename = imageUrl.split('/').pop();
    try {
        await fetch(`http://localhost:5000/delete-image?filename=${filename}`, {
            method: 'DELETE',
        });
        console.log('✅ Ảnh đã được xóa khỏi server.');
    } catch (err) {
        console.error('❌ Không thể xóa ảnh từ server:', err);
    }
};

const deletePost = async(id) => {
    try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { imageUrl } = docSnap.data();

            // Xóa ảnh khỏi Node.js nếu có
            if (imageUrl) {
                await deleteImageFromServer(imageUrl);
            }

            // Xóa bài viết khỏi Firestore
            await deleteDoc(docRef);
            return true;
        } else {
            console.warn('Bài viết không tồn tại.');
            return false;
        }
    } catch (err) {
        console.error('Lỗi khi xóa bài viết:', err);
        return false;
    }
};

export default deletePost;