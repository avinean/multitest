import { db } from "../utils/firebaseAdmin";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (body.invoiceId && body.status === 'success') {
      // Check if document exists before updating
      const docRef = db.collection('payments').doc(body.invoiceId);
      const doc = await docRef.get();
      
      if (doc.exists) {
        const paymentData = doc.data() as Payment;

        if (!paymentData) {
          console.log(`Payment data is undefined for ${body.invoiceId}`);
          return;
        }
        
        // Only update if document exists
        await docRef.update({
          status: body.status,
          amount: body.amount / 100,
          updatedAt: new Date().toISOString(),
          walletData: body.walletData || {}
        });

        if (paymentData.type === 'subscribe') {
          const docRef = db.collection('profiles').doc(paymentData.email);
          const doc = await docRef.get();
          const profileData = doc.data() as Profile;

          if (profileData?.subscriptions?.find(subscription => subscription.invoiceId === paymentData.invoiceId)) {
            return;
          }

          await docRef.update({
            subscriptions: [
              ...(profileData?.subscriptions || []),
              {
                planId: paymentData.planId,
                invoiceId: paymentData.invoiceId,
                expiryDate: new Date(paymentData.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000,
                updatedAt: new Date().toISOString()
              }
            ]
          })
        }
      } else {
        console.log(`Payment document ${body.invoiceId} not found, skipping update`);
      }
    }
  } catch (error) {
    console.error('!!!!!! Error in mono.post.ts:', error)
  }
}) 


