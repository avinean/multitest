import { setDoc, doc } from 'firebase/firestore'

export default function useMono() {
  const { monoKey, monoUrl, monoWebhookUrl } = useRuntimeConfig().public
  const db = useFirestore()

  async function pay({
    amount = 100,
    type = 'support',
    planId
  }: {
    amount?: number,
    type?: 'support' | 'subscribe',
    planId?: string
  }) {
    const { user } = await useAuth()
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
        ...(type === 'subscribe' ? {
          saveCardData: {
            saveCard: true,
            walletId: user.value!.uid
          }
        } : {}),
        webHookUrl: monoWebhookUrl
      } satisfies SinglePayment
    })

    try {
      if (user.value) {
        try {
          const paymentData = {
            invoiceId,
            email: user.value.email,
            type,
            createdAt: new Date().toISOString()
          }
          if (planId) {
            paymentData.planId = planId
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
