'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

export default function ChatBotFAB() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat Window (UI only) */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[70] w-80 bg-white border border-surface-container shadow-large animate-slide-up">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary text-white">
            <div className="w-8 h-8 bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Altunel Destek</p>
              <p className="text-xs text-white/80">Genellikle anında yanıtlar</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Sohbeti kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 h-56 overflow-y-auto bg-surface-container-low">
            <div className="flex gap-2">
              <div className="w-7 h-7 bg-primary flex-shrink-0 flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white border border-surface-container px-3 py-2 max-w-[85%]">
                <p className="text-sm text-on-surface">
                  Merhaba! 👋 Altunel Bisiklet müşteri hizmetlerine hoş geldiniz. Size nasıl yardımcı olabilirim?
                </p>
                <p className="text-xs text-secondary mt-1">12:00</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-primary text-white px-3 py-2 max-w-[85%]">
                <p className="text-sm">Elektrikli bisiklet hakkında bilgi almak istiyorum.</p>
                <p className="text-xs text-white/70 mt-1">12:01</p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-7 h-7 bg-primary flex-shrink-0 flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white border border-surface-container px-3 py-2 max-w-[85%]">
                <p className="text-sm text-on-surface">
                  Harika seçim! 🚴‍♂️ Şu anda 250W–500W motor güçlerinde modellerimiz mevcut. Hangi kullanım amacı için arıyorsunuz?
                </p>
                <p className="text-xs text-secondary mt-1">12:01</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-surface-container">
            <div className="flex items-center gap-2 p-3">
              <input
                type="text"
                placeholder="Mesajınızı yazın..."
                className="flex-1 text-sm bg-surface-container-low px-3 py-2 text-on-surface placeholder-secondary focus:outline-none focus:bg-white border border-surface-container focus:border-primary transition-colors"
                aria-label="Mesaj yaz"
              />
              <button
                className="w-9 h-9 bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors flex-shrink-0"
                aria-label="Mesaj gönder"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-xs text-secondary pb-2">
              Bu sohbet yalnızca demo amaçlıdır
            </p>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-[60] w-14 h-14 bg-primary text-white flex items-center justify-center shadow-medium hover:shadow-large hover:scale-110 transition-all duration-300 ${
          isOpen ? 'rotate-0' : ''
        }`}
        aria-label="Müşteri desteği"
        id="chatbot-fab-btn"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  )
}
