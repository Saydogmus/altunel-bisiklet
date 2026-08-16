'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Download, X, Loader2 } from 'lucide-react'

interface ParsedProduct {
  name: string
  slug: string
  category_id: string
  price: string
  stock: string
  description: string
  brand: string
  sku: string
  images: string
}

interface UploadResult {
  success: number
  failed: number
  errors: string[]
}

// Farklı sütun adlarını standart alanlara eşle
const COLUMN_MAP: Record<string, keyof ParsedProduct> = {
  // name
  name: 'name', 'ürün adı': 'name', 'urun_adi': 'name', 'urun adi': 'name',
  'ürün_adı': 'name', 'başlık': 'name', 'baslik': 'name', 'title': 'name',
  // slug
  slug: 'slug',
  // category_id
  category_id: 'category_id', 'kategori': 'category_id', 'category': 'category_id',
  'kategori_id': 'category_id', 'category slug': 'category_id',
  // price
  price: 'price', 'fiyat': 'price', 'base_price': 'price', 'fiyat (tl)': 'price',
  'fiyat(tl)': 'price', 'satiş fiyatı': 'price', 'satis_fiyati': 'price',
  // stock
  stock: 'stock', 'stok': 'stock', 'adet': 'stock', 'quantity': 'stock',
  // description
  description: 'description', 'açıklama': 'description', 'aciklama': 'description',
  'desc': 'description',
  // brand
  brand: 'brand', 'marka': 'brand',
  // sku
  sku: 'sku', 'stok kodu': 'sku', 'stok_kodu': 'sku', 'kod': 'sku',
  'urun_kodu': 'sku', 'ürün kodu': 'sku',
  // images
  images: 'images', 'görsel': 'images', 'gorsel': 'images', 'resim': 'images',
  'image': 'images', 'image_url': 'images',
}

// CSV satırını doğru şekilde ayrıştır (tırnak içindeki virgülleri yoksay)
function parseCSVLine(line: string, sep: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (!inQuotes && line.slice(i, i + sep.length) === sep) {
      result.push(current.trim())
      current = ''
      i += sep.length - 1
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

function detectSeparator(firstLine: string): string {
  const commaCount = (firstLine.match(/,/g) || []).length
  const semicolonCount = (firstLine.match(/;/g) || []).length
  const tabCount = (firstLine.match(/\t/g) || []).length
  if (tabCount > commaCount && tabCount > semicolonCount) return '\t'
  if (semicolonCount > commaCount) return ';'
  return ','
}

function parseCSV(text: string): ParsedProduct[] {
  // BOM karakterini temizle
  const cleaned = text.replace(/^\uFEFF/, '').trim()
  const lines = cleaned.split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) throw new Error('CSV dosyası boş veya başlık satırı eksik.')

  const sep = detectSeparator(lines[0])
  const rawHeaders = parseCSVLine(lines[0], sep).map(h =>
    h.toLowerCase().replace(/\"/g, '').trim()
  )

  // Sütun eşlemesi
  const mapped = rawHeaders.map(h => COLUMN_MAP[h] ?? null)
  const hasName = mapped.some(m => m === 'name')
  if (!hasName) {
    throw new Error(
      `"name" veya "ürün adı" sütunu bulunamadı.\nBulunan sütunlar: ${rawHeaders.join(', ')}`
    )
  }

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line, sep).map(v => v.replace(/\"/g, '').trim())
    const obj: Record<string, string> = {}
    rawHeaders.forEach((_, i) => {
      const field = mapped[i]
      if (field) obj[field] = values[i] ?? ''
    })
    return obj as unknown as ParsedProduct
  }).filter(p => p.name) // boş satırları atla
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).slice(2, 7)
}

// Kategori slug → UUID çözümleyici (API'den çekilir)
async function resolveCategoryId(slugOrId: string, categoryMap: Record<string, string>): Promise<string | null> {
  if (!slugOrId) return null
  // UUID formatında mı?
  if (/^[0-9a-f-]{36}$/.test(slugOrId)) return slugOrId
  return categoryMap[slugOrId.toLowerCase()] ?? null
}

export default function BulkUploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedProduct[]>([])
  const [status, setStatus] = useState<'idle' | 'parsing' | 'preview' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) {
      setErrorMsg('Lütfen bir .csv dosyası seçin.')
      setStatus('error')
      return
    }
    setFile(f)
    setStatus('parsing')
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = parseCSV(e.target?.result as string)
        setParsedData(data)
        setStatus('preview')
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Dosya okunamadı.')
        setStatus('error')
      }
    }
    reader.readAsText(f, 'UTF-8')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleUpload = async () => {
    setStatus('uploading')
    setProgress(0)

    const result: UploadResult = { success: 0, failed: 0, errors: [] }

    try {
      // 1) Kategori listesini çek
      const catRes = await fetch('/api/categories')
      const categories: { id: string; slug: string; name: string }[] = catRes.ok ? await catRes.json() : []
      const categoryMap: Record<string, string> = {}
      categories.forEach(c => {
        categoryMap[c.slug] = c.id
        categoryMap[c.name.toLowerCase()] = c.id
      })

      // 2) Her ürünü sırayla yükle
      for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i]
        setProgress(Math.round(((i + 1) / parsedData.length) * 100))

        try {
          const categoryId = await resolveCategoryId(row.category_id, categoryMap)

          const payload = {
            name: row.name,
            slug: row.slug || generateSlug(row.name),
            categoryId: categoryId,
            price: parseFloat(row.price?.replace(',', '.') || '0') || 0,
            stock: parseInt(row.stock || '0', 10) || 0,
            description: row.description || '',
            brand: row.brand || '',
            sku: row.sku || '',
            images: row.images ? row.images.split('|').map(s => s.trim()).filter(Boolean) : [],
          }

          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

          if (res.ok) {
            result.success++
          } else {
            const err = await res.json()
            result.failed++
            result.errors.push(`${row.name}: ${err.error || 'Bilinmeyen hata'}`)
          }
        } catch {
          result.failed++
          result.errors.push(`${row.name}: Bağlantı hatası`)
        }

        // Rate limiting önlemi
        if (i % 10 === 9) await new Promise(r => setTimeout(r, 300))
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Yükleme sırasında hata oluştu.')
      setStatus('error')
      return
    }

    setUploadResult(result)
    setStatus('success')
  }

  const reset = () => {
    setFile(null)
    setParsedData([])
    setStatus('idle')
    setErrorMsg('')
    setUploadResult(null)
    setProgress(0)
  }

  const downloadTemplate = () => {
    const header = 'name,slug,category_id,price,stock,description,brand,sku,images'
    const rows = [
      '"Trek Marlin 5","trek-marlin-5","dag-bisikleti","18500","10","Açıklama metni","Trek","TRK-ML5",""',
      '"Merida Speeder 100","merida-speeder","sehir-bisikleti","9800","5","Şehir bisikleti","Merida","MRD-SP100",""',
    ]
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'altunel-urun-sablonu.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8 pb-5 border-b border-surface-container">
        <h1 className="font-headline font-bold text-headline-md text-on-surface">
          Toplu Ürün Yükleme
        </h1>
        <p className="text-secondary mt-1 text-sm">
          CSV formatında hazırladığınız ürünleri toplu olarak Supabase&apos;e yükleyin.
        </p>
      </div>

      {/* Template Download */}
      <div className="mb-6 p-4 bg-surface-container-low border border-surface-container flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-on-surface text-sm">CSV Şablonunu İndir</p>
          <p className="text-xs text-secondary mt-0.5">
            Zorunlu: <strong>name</strong>, <strong>price</strong> · Desteklenen ayırıcılar: <code className="bg-surface-container px-1">,</code> <code className="bg-surface-container px-1">;</code> <code className="bg-surface-container px-1">tab</code>
          </p>
        </div>
        <button onClick={downloadTemplate} className="btn-outline py-2.5 px-4 text-sm whitespace-nowrap flex-shrink-0" id="download-template-btn">
          <Download className="w-4 h-4" />
          Şablon İndir
        </button>
      </div>

      {/* Upload Area */}
      {(status === 'idle' || status === 'error') && (
        <>
          <div
            className={`border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragging ? 'border-primary bg-red-50' : 'border-surface-container hover:border-secondary hover:bg-surface-container-low'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            id="csv-drop-zone"
          >
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            <Upload className="w-10 h-10 text-secondary mx-auto mb-4" />
            <p className="font-semibold text-on-surface mb-1">CSV dosyanızı sürükleyip bırakın</p>
            <p className="text-sm text-secondary">veya dosya seçmek için tıklayın</p>
            <p className="text-xs text-secondary mt-3">Maksimum 10MB · .csv formatı · UTF-8 veya Windows-1254</p>
          </div>
          {status === 'error' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary whitespace-pre-wrap">{errorMsg}</p>
            </div>
          )}
        </>
      )}

      {/* Parsing */}
      {status === 'parsing' && (
        <div className="text-center py-16 border border-surface-container">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary">Dosya işleniyor...</p>
        </div>
      )}

      {/* Preview */}
      {status === 'preview' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              <span className="font-medium text-on-surface">{file?.name}</span>
              <span className="text-sm text-secondary">— {parsedData.length} ürün bulundu</span>
            </div>
            <button onClick={reset} className="p-1.5 hover:bg-surface-container transition-colors">
              <X className="w-4 h-4 text-secondary" />
            </button>
          </div>

          <div className="border border-surface-container overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  {['Ürün Adı', 'Kategori', 'Fiyat', 'Stok', 'Marka', 'SKU'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-secondary border-b border-surface-container">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {parsedData.slice(0, 10).map((row, i) => (
                  <tr key={i} className={`hover:bg-surface-container-low transition-colors ${!row.name ? 'opacity-40' : ''}`}>
                    <td className="px-4 py-3 text-on-surface font-medium max-w-[200px] truncate">{row.name || '—'}</td>
                    <td className="px-4 py-3 text-secondary">{row.category_id || '—'}</td>
                    <td className="px-4 py-3 text-on-surface">{row.price ? `${Number(row.price.replace(',', '.')).toLocaleString('tr-TR')} ₺` : '—'}</td>
                    <td className="px-4 py-3 text-on-surface">{row.stock || '—'}</td>
                    <td className="px-4 py-3 text-secondary">{row.brand || '—'}</td>
                    <td className="px-4 py-3 text-secondary font-mono text-xs">{row.sku || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedData.length > 10 && (
              <div className="px-4 py-3 bg-surface-container-low border-t border-surface-container text-sm text-secondary">
                ... ve {parsedData.length - 10} ürün daha
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={reset} className="btn-outline">İptal</button>
            <button onClick={handleUpload} className="btn-primary flex-1 justify-center" id="confirm-upload-btn">
              <Upload className="w-4 h-4" />
              {parsedData.length} Ürünü Supabase&apos;e Yükle
            </button>
          </div>
        </div>
      )}

      {/* Uploading */}
      {status === 'uploading' && (
        <div className="border border-surface-container p-10 text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="font-semibold text-on-surface mb-2">Yükleniyor... %{progress}</p>
          <p className="text-sm text-secondary mb-4">{parsedData.length} ürün veritabanına aktarılıyor</p>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success */}
      {status === 'success' && uploadResult && (
        <div className={`text-center py-12 border px-8 ${uploadResult.failed > 0 ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
          <CheckCircle className={`w-12 h-12 mx-auto mb-4 ${uploadResult.failed > 0 ? 'text-yellow-500' : 'text-green-600'}`} />
          <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
            Yükleme Tamamlandı
          </h2>
          <div className="flex justify-center gap-8 mb-6 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{uploadResult.success}</p>
              <p className="text-sm text-secondary">Başarılı</p>
            </div>
            {uploadResult.failed > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{uploadResult.failed}</p>
                <p className="text-sm text-secondary">Başarısız</p>
              </div>
            )}
          </div>
          {uploadResult.errors.length > 0 && (
            <div className="text-left bg-white border border-red-200 p-4 mb-6 max-h-40 overflow-y-auto">
              <p className="text-xs font-semibold text-primary mb-2">Hatalar:</p>
              {uploadResult.errors.slice(0, 20).map((e, i) => (
                <p key={i} className="text-xs text-secondary">{e}</p>
              ))}
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button onClick={reset} className="btn-outline">Yeni Dosya Yükle</button>
            <a href="/admin/urunler" className="btn-primary">Ürünleri Gör</a>
          </div>
        </div>
      )}

      {/* Format Info */}
      <div className="mt-8 p-5 border border-surface-container bg-surface-container-low">
        <h3 className="font-semibold text-on-surface mb-3 text-sm">CSV Formatı & Kabul Edilen Sütun Adları</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-secondary">
          <div>
            <p className="font-semibold text-on-surface mb-1">Ürün Adı (zorunlu)</p>
            <p className="text-xs font-mono">name · ürün adı · title · başlık</p>
          </div>
          <div>
            <p className="font-semibold text-on-surface mb-1">Fiyat</p>
            <p className="text-xs font-mono">price · fiyat · base_price</p>
          </div>
          <div>
            <p className="font-semibold text-on-surface mb-1">Kategori</p>
            <p className="text-xs font-mono">category_id · kategori · category</p>
            <p className="text-xs mt-1">dag-bisikleti · sehir-bisikleti · elektrikli-bisiklet...</p>
          </div>
          <div>
            <p className="font-semibold text-on-surface mb-1">Stok</p>
            <p className="text-xs font-mono">stock · stok · adet · quantity</p>
          </div>
          <div>
            <p className="font-semibold text-on-surface mb-1">Marka</p>
            <p className="text-xs font-mono">brand · marka</p>
          </div>
          <div>
            <p className="font-semibold text-on-surface mb-1">SKU / Ürün Kodu</p>
            <p className="text-xs font-mono">sku · stok kodu · ürün kodu · kod</p>
          </div>
        </div>
      </div>
    </div>
  )
}
