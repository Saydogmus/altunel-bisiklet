declare module 'iyzipay' {
  interface IyzipayConfig {
    apiKey: string
    secretKey: string
    uri: string
  }

  interface IyzipayStatic {
    LOCALE: { TR: string; EN: string }
    CURRENCY: { TRY: string; EUR: string; USD: string; GBP: string }
    PAYMENT_GROUP: { PRODUCT: string; LISTING: string; SUBSCRIPTION: string }
    BASKET_ITEM_TYPE: { PHYSICAL: string; VIRTUAL: string }
    PAYMENT_CHANNEL: { WEB: string; MOBILE: string; MOBILE_WEB: string }
  }

  class Iyzipay implements IyzipayStatic {
    constructor(config: IyzipayConfig)
    static LOCALE: { TR: string; EN: string }
    static CURRENCY: { TRY: string; EUR: string; USD: string; GBP: string }
    static PAYMENT_GROUP: { PRODUCT: string; LISTING: string; SUBSCRIPTION: string }
    static BASKET_ITEM_TYPE: { PHYSICAL: string; VIRTUAL: string }
    static PAYMENT_CHANNEL: { WEB: string; MOBILE: string; MOBILE_WEB: string }

    checkoutFormInitialize: {
      create(request: any, callback: (err: any, result: any) => void): void
    }
    checkoutForm: {
      retrieve(request: any, callback: (err: any, result: any) => void): void
    }
    payment: {
      create(request: any, callback: (err: any, result: any) => void): void
    }
  }

  export = Iyzipay
}
