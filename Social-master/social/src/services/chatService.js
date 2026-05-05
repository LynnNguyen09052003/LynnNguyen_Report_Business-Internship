import API from './api';

export const getUserByMail = async (mail) => {
    const res = await API.get(`api/get-user-by-mail?mail=${mail}`);
    return res.data;
};

export const initconversation = async (uerId, friendId, ConversationName) => {
    const res = await API.get(`api/init-conversation?userId=${userId}&friendId=${friendId}&nameConversation=${ConversationName}`);
    return res.data;
};

export const getConversationByUser = async (userId) => {
    const res = await API.get(`api/get-conversation?userId=${userId}`);
    return res.data;
};

export const getMessageinConversation = async (conversationId) => {
    const res = await API.get(`api/Chat/api/get-message-in-conversation?conversationId=${conversationId}`);
    return res.data;
};