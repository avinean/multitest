import { db } from "../utils/firebaseAdmin";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (body.invoiceId && body.status === 'success') {
      await db.collection("payments").doc(body.invoiceId).set({
        status: body.status,
        amount: body.amount / 100,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    console.error('!!!!!! Error in mono.post.ts:', error)
  }
}) 


