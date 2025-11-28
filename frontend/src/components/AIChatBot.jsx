import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import styles from './AIChatBot.module.css';
import { 
  RobotIcon, 
  ChatIcon, 
  BugIcon, 
  CheckCircleIcon, 
  SendIcon, 
  CloseIcon, 
  EnvelopeIcon 
} from './icons/AIChatBotIcons';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' veya 'bug'
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Selamlar hocam! Ben FluxBot, Flux Teknoloji\'nin yapay zeka asistanıyım. Devrelerim tıkır tıkır çalışıyor! Bugün size nasıl yardımcı olabilirim? Yeni bir canavar (bilgisayar) mı topluyoruz?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Bug Report State
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugPriority, setBugPriority] = useState('medium');
  const [bugSubmitting, setBugSubmitting] = useState(false);
  const [bugSuccess, setBugSuccess] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Kullanıcı mesajını ekle
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/`, {
        message: userMessage,
        history: messages
      });

      if (response.data.success) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.data.response 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' 
        }]);
      }
    } catch (error) {
      console.error('Chat hatası:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Bug Report Gönderme
  const handleSubmitBug = async (e) => {
    e.preventDefault();
    if (!bugTitle.trim() || !bugDescription.trim()) return;
    
    setBugSubmitting(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post(`${API_URL}/bug-reports/`, {
        title: bugTitle,
        description: bugDescription,
        priority: bugPriority,
        page_url: window.location.href,
        user_agent: navigator.userAgent
      }, { headers });
      
      setBugSuccess(true);
      setBugTitle('');
      setBugDescription('');
      setBugPriority('medium');
      
      // 3 saniye sonra success mesajını kaldır
      setTimeout(() => {
        setBugSuccess(false);
        setActiveTab('chat');
      }, 3000);
      
    } catch (error) {
      console.error('Bug report hatası:', error);
      alert('Hata bildirimi gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setBugSubmitting(false);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      {/* Chat Penceresi */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.botAvatar}>
                <RobotIcon size={24} color="white" />
              </div>
              <div>
                <h3>FluxBot</h3>
                <span className={styles.onlineStatus}>Çevrimiçi</span>
              </div>
            </div>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon size={20} color="white" />
            </button>
          </div>

          {/* Tab Butonları */}
          <div className={styles.tabContainer}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'chat' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <span className={styles.tabIcon}><ChatIcon size={16} /></span> Sohbet
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'bug' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('bug')}
            >
              <span className={styles.tabIcon}><BugIcon size={16} /></span> Hata Bildir
            </button>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <>
              {/* Mesajlar */}
              <div className={styles.messagesContainer}>
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className={styles.messageAvatar}>
                        <RobotIcon size={18} color="white" />
                      </div>
                    )}
                    <div className={styles.messageContent}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className={`${styles.message} ${styles.assistantMessage}`}>
                    <div className={styles.messageAvatar}>
                      <RobotIcon size={18} color="white" />
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.typingIndicator}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Mesajınızı yazın..."
                  disabled={isLoading}
                  className={styles.chatInput}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className={styles.sendButton}
                >
                  <SendIcon size={20} color="white" />
                </button>
              </div>
            </>
          )}

          {/* Bug Report Tab */}
          {activeTab === 'bug' && (
            <div className={styles.bugContainer}>
              {bugSuccess ? (
                <div className={styles.bugSuccess}>
                  <span className={styles.successIcon}>
                    <CheckCircleIcon size={64} color="#10b981" />
                  </span>
                  <h3>Teşekkürler!</h3>
                  <p>Hata bildiriminiz başarıyla gönderildi. Ekibimiz en kısa sürede inceleyecektir.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitBug} className={styles.bugForm}>
                  <div className={styles.bugIntro}>
                    <span className={styles.introIcon}>
                      <BugIcon size={32} color="#92400e" />
                    </span>
                    <p>Sitede bir hata mı buldunuz? Bize bildirin, düzeltelim!</p>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="bugTitle">Hata Başlığı</label>
                    <input
                      id="bugTitle"
                      type="text"
                      value={bugTitle}
                      onChange={(e) => setBugTitle(e.target.value)}
                      placeholder="Örn: Sepete ürün eklenmiyor"
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="bugDescription">Açıklama</label>
                    <textarea
                      id="bugDescription"
                      value={bugDescription}
                      onChange={(e) => setBugDescription(e.target.value)}
                      placeholder="Hatayı detaylı olarak açıklayın. Ne yapmaya çalışıyordunuz? Ne oldu?"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="bugPriority">Öncelik</label>
                    <select
                      id="bugPriority"
                      value={bugPriority}
                      onChange={(e) => setBugPriority(e.target.value)}
                    >
                      <option value="low">Düşük - Küçük bir sorun</option>
                      <option value="medium">Orta - Normal hata</option>
                      <option value="high">Yüksek - Önemli hata</option>
                      <option value="critical">Kritik - Site kullanılamıyor</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit" 
                    className={styles.submitBugButton}
                    disabled={bugSubmitting}
                  >
                    {bugSubmitting ? (
                      'Gönderiliyor...'
                    ) : (
                      <>
                        <EnvelopeIcon size={18} style={{ marginRight: '8px' }} /> Hata Bildir
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Açma Butonu */}
      <button 
        className={`${styles.chatToggle} ${isOpen ? styles.hidden : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <span className={styles.chatIcon}>
          <ChatIcon size={24} color="white" />
        </span>
        <span className={styles.chatLabel}>Yardım</span>
      </button>
    </div>
  );
};

export default AIChatBot;
