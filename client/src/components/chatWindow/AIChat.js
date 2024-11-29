import React, { useState } from 'react';
import { SendHorizonalIcon} from 'lucide-react';

const messagesData = [
  { id: 1, content: 'How do we handle this deployment error?', timestamp: new Date().getTime(), isUser: true, userName: 'You', avatar: 'https://via.placeholder.com/150' },
  { id: 2, content: 'Try checking the server configurations.', timestamp: new Date().getTime(), isUser: false, userName: 'Investment advisor ', avatar: '/invest.png' },
  { id: 3, content: 'I think there might be an issue with our CDN configuration.', timestamp: new Date().getTime(),isUser: true, isUser: true, userName: 'You', avatar: 'https://via.placeholder.com/150' },
  { id: 4, content: "Yes, James is right. Let's check that as well.", timestamp: new Date().getTime(), isUser: false, userName: 'Budget Advisor', avatar: '/coin.png' },
  { id: 5, content: 'I think there might be an issue with our CDN configuration.', timestamp: new Date().getTime(), isUser: false, userName: 'Stock analysor', avatar: '/stock.png' },

  { id: 6, content: 'Deployment error fixed. Good job, team!', timestamp: new Date().getTime(), isUser: false, userName: 'News Updator', avatar: '/news.png' }
];

export default function AiChat() {
  const [messages, setMessages] = useState(messagesData);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message = { id: messages.length + 1, content: newMessage, timestamp: new Date().getTime(), isUser: true, userName: 'You', avatar: 'https://via.placeholder.com/150' };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className='flex flex-col w-[700px] border-transparent bg-white/20 backdrop-blur-lg rounded-lg mr-auto ml-5'>
      <div className='flex-grow overflow-auto p-4 space-y-4 overflow-y-auto'>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
            {!msg.isUser && <img src={msg.avatar} alt='avatar' className='w-10 object-cover h-10 rounded-full' />}
            <div className={`rounded-xl px-4 py-2 shadow-2xl shadow-[#131213] ${msg.isUser ? 'bg-purple-800 text-white' : 'bg-black text-white'}`}>
              <p className='font-bold'>{msg.userName}</p>
              <p>{msg.content}</p>
              <p className='text-xs mt-1'>7:42 PM</p>
              {/* {format(new Date(msg.timestamp), 'p')} */}
            </div>
          </div>
        ))}
      </div>
      <div className='p-4 border-t-2 border-black flex items-center'>
        <input className='flex-grow p-2 mr-4 border-gray-500 rounded bg-black ' placeholder='Type your message here…' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onPress={(e) => e.key === 'Enter' && sendMessage()} />
        <button className='py-2 px-6 bg-purple-900 text-white rounded hover:bg-blue-600 transition duration-150' disabled={!newMessage.trim()} onClick={sendMessage}><SendHorizonalIcon /></button>
      </div>
    </div>
  )
}