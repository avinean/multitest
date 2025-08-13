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
        redirectUrl: location.origin + '/' + locale.value + '/support/success?support=true',
      }
    })

    window.open(pageUrl, '_blank')
  }

  async function checkPayment(invoiceId: string) {
    return $fetch<{ 
      amount: number,
      ccy: number,
      createdDate: string,
      finalAmount: number,
      invoiceId: string,
      modifiedDate: string,
      payMethod: string,
      paymentInfo: {
        approvalCode: string,
        bank: string,
        country: string,
        fee: number,
        maskedPan: string,
        paymentMethod: string,
        paymentSystem: string,
        rrn: string,
        terminal: string,
        tranId: string,
      },
      status: string
    } > (monoUrl + '/api/merchant/invoice/status', {
      headers: {
        'X-Token': monoKey
      },
      query: {
        invoiceId
      }
    })
  }

  return {
    pay,
    checkPayment
  }
}
