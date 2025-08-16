import { setDoc, doc } from 'firebase/firestore'

export default function useMono() {
  const { monoKey, monoUrl, monoWebhookUrl } = useRuntimeConfig().public
  const { locale } = useI18n()
  const db = useFirestore()

  async function pay(amount = 100) {
    const { pageUrl, invoiceId } = await $fetch<{ invoiceId: string, pageUrl: string}>(monoUrl + '/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'X-Token': monoKey
      },
      body: {
        amount,
        merchantPaymInfo: {
          destination: 'Оплата за інформаційні та консультаційні послуги',
          comment: 'Оплата за інформаційні та консультаційні послуги',
        },
        redirectUrl: location.origin + '/' + locale.value + '/support/success?support=true',
        webHookUrl: monoWebhookUrl
      } satisfies SinglePayment
    })

    try {
      const { user } = await useAuth()
      if (user.value) {
        try {
          const paymentData = {
            invoiceId,
            email: user.value.email,
            type: 'support',
            createdAt: new Date().toISOString()
          }
          
          await setDoc(doc(db, 'payments', invoiceId), paymentData)
          console.log('Payment saved to database:', paymentData)
        } catch (error) {
          console.error('Error saving payment to database:', error)
        }
      }
    } catch (error) {
      console.error('Error getting auth:', error)
    }

    window.open(pageUrl, '_blank')
  }

  return {
    pay
  }
}
