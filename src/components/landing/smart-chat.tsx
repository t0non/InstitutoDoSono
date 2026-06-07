'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
import { config } from '@/lib/config';
import { WhatsAppIcon } from '../icons';

const TypingIndicator = () => (
  <div className="typing-dots">
    <span />
    <span />
    <span />
  </div>
);

const SmartChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bubbles, setBubbles] = useState<
    { id: string; content: React.ReactNode; show: boolean }[]
  >([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    const createBubble = (id: string, initialContent: React.ReactNode) => {
      setBubbles((prev) => [...prev, { id, content: initialContent, show: false }]);
      timeouts.push(
        setTimeout(() => {
          setBubbles((prev) =>
            prev.map((b) => (b.id === id ? { ...b, show: true } : b))
          );
        }, 100)
      );
    };

    const updateBubble = (id: string, newContent: React.ReactNode) => {
      timeouts.push(
        setTimeout(() => {
          setBubbles((prev) =>
            prev.map((b) => (b.id === id ? { ...b, content: newContent } : b))
          );
        }, 1500)
      );
    };

    timeouts.push(
      setTimeout(() => {
        createBubble('msg-1', <TypingIndicator />);
        updateBubble('msg-1', 'Oi, tudo bem? 👋');

        timeouts.push(
          setTimeout(() => {
            createBubble('msg-2', <TypingIndicator />);
            updateBubble('msg-2', 'Vamos agendar sua consulta hoje?');
          }, 2500)
        );
      }, 1500)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="smart-chat-widget">
      {!isOpen && (
        <div id="teaser-container">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              id={bubble.id}
              className={`chat-bubble ${bubble.show ? 'show' : ''}`}
              onClick={toggleChat}
            >
              {bubble.content}
            </div>
          ))}
        </div>
      )}

      <div className="chat-avatar-container" onClick={toggleChat}>
        <div className="avatar-circle">
          <Image
            src="https://files.catbox.moe/j9y3vf.png"
            alt="Atendente Beth"
            width={65}
            height={65}
          />
        </div>
        <div className="online-status" />
      </div>

      <div id="chat-window" className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="header-info">
            <div className="header-avatar">
              <Image
                src="https://files.catbox.moe/j9y3vf.png"
                alt="Atendente Beth"
                width={40}
                height={40}
              />
              <div className="header-status" />
            </div>
            <div>
              <h4>Beth - Atendente</h4>
              <span>Online agora</span>
            </div>
          </div>
          <button className="close-chat" onClick={toggleChat}>
            <X size={20} />
          </button>
        </div>

        <div className="chat-body">
          <div className="message-received">
            Olá! 👋 Sou a Beth do Instituto do Sono.
          </div>
          <div className="message-received">
            Vi que você está procurando cuidar do seu sono. Posso te ajudar a agendar?
          </div>
        </div>

        <div className="chat-footer">
          <a
            href={config.whatsappLinkConsulta}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-chat"
          >
            <WhatsAppIcon className="h-5 w-5 mr-2" /> Sim, quero agendar <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SmartChat;
