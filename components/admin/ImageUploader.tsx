'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, Link as LinkIcon, Loader2, ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  value: string        // mevcut görsel URL
  onChange: (url: string) => void
  label?: string
}

export default function ImageUploader({ value, onChange, label = 'Ürün Görseli' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [tab, setTab] = useState<'upload' | 'url'>(value ? 'upload' : 'upload')
  const [urlInput, setUrlInput] = useState(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Yükleme başarısız.')
      onChange(data.url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Yükleme hatası.')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  const handleUrlApply = () => {
    if (urlInput.trim()) onChange(urlInput.trim())
  }

  const handleRemove = () => {
    onChange('')
    setUrlInput('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-on-surface">{label}</label>

      {/* Sekme */}
      <div className="flex border border-surface-container">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            tab === 'upload' ? 'bg-primary text-white' : 'bg-white text-secondary hover:bg-surface-container-low'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Dosya Yükle
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            tab === 'url' ? 'bg-primary text-white' : 'bg-white text-secondary hover:bg-surface-container-low'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          URL Gir
        </button>
      </div>

      {/* Dosya Yükleme Alanı */}
      {tab === 'upload' && (
        <div
          className={`border-2 border-dashed transition-all duration-200 ${
            dragOver ? 'border-primary bg-red-50' : 'border-surface-container hover:border-secondary'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-secondary">Supabase&apos;e yükleniyor...</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center py-8 gap-2"
            >
              <Upload className="w-8 h-8 text-secondary" />
              <p className="text-sm font-medium text-on-surface">Görsel seç veya sürükle</p>
              <p className="text-xs text-secondary">JPG, PNG, WebP — Maks. 5MB</p>
            </button>
          )}
        </div>
      )}

      {/* URL Girişi */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="btn-primary px-4 py-2.5 text-sm"
          >
            Uygula
          </button>
        </div>
      )}

      {/* Hata */}
      {error && (
        <p className="text-xs text-primary font-medium">{error}</p>
      )}

      {/* Önizleme */}
      {value && (
        <div className="relative border border-surface-container bg-surface-container-low p-3">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Önizleme</p>
          <div className="relative w-full aspect-video bg-white">
            <Image
              src={value}
              alt="Ürün görseli önizleme"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-primary text-white flex items-center justify-center hover:bg-red-700 transition-colors"
            title="Görseli kaldır"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="text-xs text-secondary mt-2 truncate">{value}</p>
        </div>
      )}

      {/* Görsel yoksa placeholder */}
      {!value && !uploading && (
        <div className="flex items-center gap-3 p-3 bg-surface-container-low border border-surface-container text-secondary">
          <ImageIcon className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs">Henüz görsel yüklenmedi</p>
        </div>
      )}
    </div>
  )
}
