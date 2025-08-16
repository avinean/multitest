export default function useMono() {
  const { monoKey, monoUrl } = useRuntimeConfig().public
  const { locale } = useI18n()

  async function pay(amount = 100) {
    const { pageUrl } = await $fetch<{ invoiceId: string, pageUrl: string}>(monoUrl + '/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'X-Token': monoKey
      },
      body: {
        amount,
        merchantPaymInfo: {
          destination: 'Оплата за інформаційні та консультаційні послуги',
        },
        redirectUrl: location.origin + '/' + locale.value + '/support/success?support=true',
      } satisfies SinglePayment
    })

    window.open(pageUrl, '_blank')
  }

  return {
    pay
  }
}
