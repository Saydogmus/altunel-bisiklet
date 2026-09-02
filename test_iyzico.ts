import { initializeCheckoutForm } from './lib/iyzico'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function main() {
  try {
    const res = await initializeCheckoutForm({
      conversationId: '123456789',
      price: '100.00',
      paidPrice: '100.00',
      basketId: 'B67832',
      callbackUrl: 'http://localhost:3000/api/checkout/callback',
      buyer: {
        id: 'BY789',
        name: 'John',
        surname: 'Doe',
        gsmNumber: '+905324000000',
        email: 'email@email.com',
        identityNumber: '74300864791',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      },
      billingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      },
      basketItems: [
        {
          id: 'BI101',
          name: 'Binocular',
          category1: 'Collectibles',
          itemType: 'PHYSICAL',
          price: '100.00',
        },
      ],
    })
    console.log(res)
  } catch (err) {
    console.error(err)
  }
}

main()
