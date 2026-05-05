// getPosts.js
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';

const getPosts = async() => {
    try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(posts);
        return posts;
    } catch (error) {
        console.error("Lỗi khi lấy data:", error);
        return [];
    }
};

export default getPosts;