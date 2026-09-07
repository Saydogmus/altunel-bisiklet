import crypto from 'crypto'

/**
 * İyzico REST API client — sunucu tarafında (API routes) kullanılır.
 * iyzipay npm paketi Next.js bundler ile uyumsuz olduğu için
 * doğrudan REST API çağrısı yapılır.
 * 
 * İmza algoritması: IYZWSv2
 * hashStr = sha256(secretKey, randomKey + uriPath + requestBody)
 * authorization = "IYZWSv2 " + base64("apiKey:API_KEY&randomKey:RND&signature:HASH")
 */

const IYZICO_BASE_URL = 'https://api.iyzipay.com'

function generateAuthorizationHeader(
  apiKey: string,
  secretKey: string,
  randomKey: string,
  uriPath: string,
  requestBody: string
): string {
  // İyzico IYZWSv2: HMAC-SHA256(secretKey, randomKey + uriPath + requestBody)
  const payload = randomKey + uriPath + requestBody
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex')

  const authStr = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`
  const base64 = Buffer.from(authStr).toString('base64')

  return `IYZWSv2 ${base64}`
}

function getRandomString(): string {
  return crypto.randomBytes(8).toString('hex') + Date.now().toString()
}

async function iyzicoRequest(path: string, body: object) {
  const apiKey = process.env.IYZICO_API_KEY
  const secretKey = process.env.IYZICO_SECRET_KEY

  if (!apiKey || !secretKey) {
    throw new Error(
      'İyzico API anahtarları eksik. .env.local dosyanıza IYZICO_API_KEY ve IYZICO_SECRET_KEY ekleyin.'
    )
  }

  const requestBody = JSON.stringify(body)

  // ══ Alan-alan format doğrulaması (İyzico errorCode 11 debug) ══
  const b = body as any
  const fieldChecks: Record<string, string> = {}

  if (b.price !== undefined)
    fieldChecks.price = typeof b.price === 'string' && /^\d+\.\d{2}$/.test(b.price)
      ? `OK (${b.price})` : `HATA — beklenen: "109.90" formatı, gelen: ${JSON.stringify(b.price)}`

  if (b.paidPrice !== undefined)
    fieldChecks.paidPrice = typeof b.paidPrice === 'string' && /^\d+\.\d{2}$/.test(b.paidPrice)
      ? `OK (${b.paidPrice})` : `HATA — beklenen: "109.90" formatı, gelen: ${JSON.stringify(b.paidPrice)}`

  if (b.buyer?.identityNumber !== undefined)
    fieldChecks['buyer.identityNumber'] = /^\d{11}$/.test(b.buyer.identityNumber)
      ? `OK (${b.buyer.identityNumber})` : `HATA — 11 haneli rakam olmalı, gelen: ${b.buyer.identityNumber}`

  if (b.buyer?.gsmNumber !== undefined)
    fieldChecks['buyer.gsmNumber'] = /^\+90\d{10}$/.test(b.buyer.gsmNumber)
      ? `OK (${b.buyer.gsmNumber})` : `HATA — +90XXXXXXXXXX formatı gerekli, gelen: ${b.buyer.gsmNumber}`

  if (b.buyer?.ip !== undefined)
    fieldChecks['buyer.ip'] = /^\d{1,3}(\.\d{1,3}){3}$/.test(b.buyer.ip)
      ? `OK (${b.buyer.ip})` : `HATA — geçerli IPv4 gerekli, gelen: ${b.buyer.ip}`

  if (b.basketItems !== undefined) {
    const itemsSum = (b.basketItems as any[]).reduce((s: number, i: any) => s + Number(i.price), 0)
    const priceVal = Number(b.price)
    fieldChecks['basketItems toplamı'] = Math.abs(itemsSum - priceVal) < 0.01
      ? `OK (${itemsSum.toFixed(2)} = price ${b.price})`
      : `HATA — basketItems toplamı ${itemsSum.toFixed(2)}, price ${b.price} — Eşleşmiyor!`
  }

  console.log('[IYZICO FIELD CHECKS]', JSON.stringify(fieldChecks, null, 2))
  console.log('[IYZICO RAW BODY]', requestBody)

  const randomKey = getRandomString()
  
  console.log('--- SIGNATURE DEBUG ---')
  console.log('1. uriPath:', path)
  console.log('2. requestBody:', requestBody)
  console.log('3. randomKey:', randomKey)
  
  const authorization = generateAuthorizationHeader(
    apiKey,
    secretKey,
    randomKey,
    path,
    requestBody
  )
  
  console.log('4. Authorization Header:', authorization)
  console.log('-----------------------')

  const response = await fetch(`${IYZICO_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorization,
      'x-iyzi-rnd': randomKey,
      'x-iyzi-client-version': 'iyzipay-node-2.0.56',
    },
    body: requestBody,
  })

  const result = await response.json()
  console.log('[IYZICO RAW RESPONSE]', JSON.stringify(result))
  return result
}

/**
 * İyzico Checkout Form başlat
 */
export async function initializeCheckoutForm(params: {
  conversationId: string
  price: string
  paidPrice: string
  basketId: string
  callbackUrl: string
  buyer: {
    id: string
    name: string
    surname: string
    gsmNumber: string
    email: string
    identityNumber: string
    registrationAddress: string
    ip: string
    city: string
    country: string
  }
  shippingAddress: {
    contactName: string
    city: string
    country: string
    address: string
  }
  billingAddress: {
    contactName: string
    city: string
    country: string
    address: string
  }
  basketItems: Array<{
    id: string
    name: string
    category1: string
    itemType: string
    price: string
  }>
}) {
  // Standart tek-satıcı Checkout Form endpoint'i.
  // '/payment/iyzipos/...' pazaryeri (marketplace) API'sidir,
  // subMerchantKey zorunlu kılar ve VPS-1080 hatasına yol açar.
  // Resmi SDK'da (CheckoutFormInitialize.js) rotanın tam ve doğru hali:
  return iyzicoRequest('/payment/iyzipos/checkoutform/initialize/auth/ecom', {
    locale: 'tr',
    conversationId: params.conversationId,
    price: params.price,
    paidPrice: params.paidPrice,
    currency: 'TRY',
    basketId: params.basketId,
    paymentGroup: 'PRODUCT',   // standard API'de de zorunlu, sub-merchant değil
    callbackUrl: params.callbackUrl,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: params.buyer,
    shippingAddress: params.shippingAddress,
    billingAddress: params.billingAddress,
    basketItems: params.basketItems,
  })
}

/**
 * İyzico Checkout Form sonucu sorgula (token ile)
 */
export async function retrieveCheckoutForm(token: string) {
  // Standart tek-satıcı Checkout Form sorgulama endpoint'i
  return iyzicoRequest('/payment/checkoutform/auth/detail', {
    locale: 'tr',
    token,
  })
}

/**
 * İyzico 3D Secure ikinci adım — banka onayı sonrası paymentId ile ödemeyi tamamla.
 * forceThreeDS: 1 ile başlatılan ödemelerde banka callbackUrl'e paymentId gönderir.
 * Bu endpoint çağrılmadan ödeme tamamlanmaz.
 */
export async function confirmThreedsPayment(params: {
  paymentId: string
  conversationData?: string
  conversationId?: string
}) {
  return iyzicoRequest('/payment/3dsecure/auth', {
    locale: 'tr',
    paymentId: params.paymentId,
    conversationData: params.conversationData || '',
    conversationId: params.conversationId || '',
  })
}
