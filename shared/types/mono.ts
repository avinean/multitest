export type Discount = {
  type: string,
  mode: string,
  value: number
}

export type BasketOrder = {
  name: string,
  qty: number,
  sum: number,
  total: number,
  icon: string,
  unit: string,
  code: string,
  barcode: string,
  header: string,
  footer: string,
  tax: number[],
  uktzed: number,
  splitReceiverId: string,
  discounts: Discount[]
}

export type MerchantPaymInfo = {
  reference?: string,
  destination?: string,
  comment?: string,
  customerEmails?: string[],
  discounts?: Discount[],
  basketOrder?: BasketOrder[],
}

export type SinglePayment = {
  amount: number,
  ccy?: number,
  merchantPaymInfo?: MerchantPaymInfo,
  redirectUrl?: string,
  webHookUrl?: string,
  validity?: number,
  paymentType?: string,
  qrId?: string,
  code?: string,
  saveCardData?: {
    saveCard?: boolean,
    walletId: string
  },
  agentFeePercent?: number,
  tipsEmployeeId?: string,
  displayType?: string
}

export interface Payment {
  id: string
  invoiceId: string
  email: string
  amount: number
  status: 'pending' | 'success'
  createdAt: string
  updatedAt: string
  planId: string
  type: 'support' | 'subscribe'
  walletData: {
    walletId: string
    cardToken: string
    status: string
  }
}
