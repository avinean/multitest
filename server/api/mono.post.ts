import { db } from "../utils/firebaseAdmin";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (body.invoiceId && body.status === 'success') {
      // Check if document exists before updating
      const docRef = db.collection("payments").doc(body.invoiceId);
      const doc = await docRef.get();
      
      if (doc.exists) {
        // Only update if document exists
        await docRef.update({
          status: body.status,
          amount: body.amount / 100,
          updatedAt: new Date().toISOString()
        });
      } else {
        console.log(`Payment document ${body.invoiceId} not found, skipping update`);
      }
    }
  } catch (error) {
    console.error('!!!!!! Error in mono.post.ts:', error)
  }
}) 


