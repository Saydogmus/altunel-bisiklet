import crypto from 'crypto'

/**
 * İyzico REST API client — sunucu tarafında (API routes) kullanılır.
 * iyzipay npm paketi Next.js bundler ile uyumsuz olduğu için
 * doğrudan REST API çağrısı yapılır.
 */

const IYZICO_BASE_URL = 'https://api.iyzipay.com'

function generateAuthorizationHeader(
  apiKey: string,
  secretKey: string,
  randomHeaderValue: string,
  requestBody: string
): string {
  const hashStr = `${randomHeaderValue}${requestBody}`
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(hashStr)
    .digest('hex')
  
  const authorizationParams = `apiKey:${apiKey}&randomKey:${randomHeaderValue}&signature:${signature}`
  const base64 = Buffer.from(authorizationParams).toString('base64')
  
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
  const randomHeaderValue = getRandomString()
  const authorization = generateAuthorizationHeader(
    apiKey,
    secretKey,
    randomHeaderValue,
    requestBody
  )

  const response = await fetch(`${IYZICO_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorization,
      'x-iyzi-rnd': randomHeaderValue,
    },
    body: requestBody,
  })

  return response.json()
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
  return iyzicoRequest(
    '/payment/iyzipos/checkoutform/initialize/auth/ecom',
    {
      locale: 'tr',
      conversationId: params.conversationId,
      price: params.price,
      paidPrice: params.paidPrice,
      currency: 'TRY',
      basketId: params.basketId,
      paymentGroup: 'PRODUCT',
      callbackUrl: params.callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: params.buyer,
      shippingAddress: params.shippingAddress,
      billingAddress: params.billingAddress,
      basketItems: params.basketItems,
    }
  )
}

/**
 * İyzico Checkout Form sonucu sorgula
 */
export async function retrieveCheckoutForm(token: string) {
  return iyzicoRequest('/payment/iyzipos/checkoutform/auth/ecom/detail', {
    locale: 'tr',
    token,
  })
}
