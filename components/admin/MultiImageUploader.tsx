'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, Link as LinkIcon, Loader2, ImageIcon, GripVertical } from 'lucide-react'

interface MultiImageUploaderProps {
  values: string[]          // mevcut görsel URL'leri
  onChange: (urls: string[]) => void
  label?: string
  maxImages?: number
}

export default function MultiImageUploader({
  values,
  onChange,
  label = 'Ürün Görselleri',
  maxImages = 10,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Yükleme başarısız.')
    return data.url as string
  }, [])

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArr = Array.from(files)
    const remaining = maxImages - values.length
    if (remaining <= 0) {
      setError(`En fazla ${maxImages} görsel yükleyebilirsiniz.`)
      return
    }
    const toUpload = fileArr.slice(0, remaining)
    setUploading(true)
    setUploadingCount(toUpload.length)
    setError(null)

    const results: string[] = []
    for (const file of toUpload) {
      try {
        const url = await uploadFile(file)
        if (url) results.push(url)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Yükleme hatası.')
      }
    }

    if (results.length > 0) {
      onChange([...values, ...results])
    }
    setUploading(false)
    setUploadingCount(0)
  }, [values, onChange, uploadFile, maxImages])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
      e.target.value = '' // reset
    }
  }

  const addUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    if (values.includes(url)) { setError('Bu URL zaten eklenmiş.'); return }
    if (values.length >= maxImages) { setError(`En fazla ${maxImages} görsel ekleyebilirsiniz.`); return }
    onChange([...values, url])
    setUrlInput('')
    setError(null)
  }

  const removeImage = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx))
  }

  const moveImage = (from: number, to: number) => {
    const arr = [...values]
    const [moved] = arr.splice(from, 1)
    arr.splice(to, 0, moved)
    onChange(arr)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-on-surface">{label}</label>
        <span className="text-xs text-secondary">{values.length}/{maxImages} görsel</span>
      </div>

      {/* Mevcut Görseller — Thumbnail Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {values.map((url, idx) => (
            <div
              key={idx}
              className="relative group border border-surface-container bg-surface-container-low overflow-hidden"
              style={{ aspectRatio: '1' }}
            >
              {/* Ana görsel badge */}
              {idx === 0 && (
                <span className="absolute top-1 left-1 z-10 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 leading-none">
                  ANA
                </span>
              )}

              <Image
                src={url}
                alt={`Görsel ${idx + 1}`}
                fill
                className="object-contain p-1"
                unoptimized
              />

              {/* Overlay butonlar */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(idx, idx - 1)}
                    title="Sola taşı"
                    className="w-7 h-7 bg-white text-on-surface flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs font-bold"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  title="Görseli kaldır"
                  className="w-7 h-7 bg-primary text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {idx < values.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(idx, idx + 1)}
                    title="Sağa taşı"
                    className="w-7 h-7 bg-white text-on-surface flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs font-bold"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Yükleniyor placeholder */}
          {uploading && Array.from({ length: uploadingCount }).map((_, i) => (
            <div
              key={`loading-${i}`}
              className="border border-dashed border-surface-container bg-surface-container-low flex items-center justify-center"
              style={{ aspectRatio: '1' }}
            >
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          ))}
        </div>
      )}

      {/* Yükleme Alanı */}
      {values.length < maxImages && (
        <>
          <div
            className={`border-2 border-dashed transition-all duration-200 cursor-pointer ${
              dragOver ? 'border-primary bg-red-50' : 'border-surface-container hover:border-secondary hover:bg-surface-container-low'
            } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
                <p className="text-sm text-secondary">{uploadingCount} görsel yükleniyor...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <Upload className="w-7 h-7 text-secondary" />
                <p className="text-sm font-medium text-on-surface">Görsel seç veya sürükle</p>
                <p className="text-xs text-secondary">Birden fazla seçebilirsiniz · JPG, PNG, WebP · Maks. 5MB</p>
              </div>
            )}
          </div>

          {/* URL Girişi */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center border border-surface-container bg-white px-3 gap-2">
              <LinkIcon className="w-4 h-4 text-secondary flex-shrink-0" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
                placeholder="https://... URL ile görsel ekle"
                className="flex-1 py-2.5 text-sm focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="button"
              onClick={addUrl}
              disabled={!urlInput.trim()}
              className="btn-outline py-2.5 px-4 text-sm disabled:opacity-40"
            >
              Ekle
            </button>
          </div>
        </>
      )}

      {/* Hata */}
      {error && <p className="text-xs text-primary font-medium">{error}</p>}

      {/* Boş durum */}
      {values.length === 0 && !uploading && (
        <div className="flex items-center gap-3 p-3 bg-surface-container-low border border-surface-container text-secondary">
          <ImageIcon className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs">Henüz görsel eklenmedi. İlk yüklediğiniz görsel ana görsel olacak.</p>
        </div>
      )}

      {/* Sıralama ipucu */}
      {values.length > 1 && (
        <p className="text-xs text-secondary flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5" />
          Görselin üzerine gelince ← → butonlarıyla sıralayabilirsiniz. İlk görsel ana görsel olarak kullanılır.
        </p>
      )}
    </div>
  )
}
