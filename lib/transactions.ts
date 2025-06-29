import { supabase } from "./supabase"

export async function createTransaction(senderId: string, recipientId: string, amount: number, memo?: string) {
  // Start a transaction
  const { data: sender } = await supabase.from("profiles").select("balance").eq("id", senderId).single()

  if (!sender || sender.balance < amount) {
    throw new Error("Insufficient balance")
  }

  // Create transaction record
  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      amount,
      memo,
      status: "pending",
    })
    .select()
    .single()

  if (transactionError) throw transactionError

  // Update balances
  const { error: senderError } = await supabase
    .from("profiles")
    .update({ balance: sender.balance - amount })
    .eq("id", senderId)

  if (senderError) {
    // Rollback transaction
    await supabase.from("transactions").delete().eq("id", transaction.id)
    throw senderError
  }

  const { data: recipient } = await supabase.from("profiles").select("balance").eq("id", recipientId).single()

  if (recipient) {
    const { error: recipientError } = await supabase
      .from("profiles")
      .update({ balance: recipient.balance + amount })
      .eq("id", recipientId)

    if (recipientError) {
      // Rollback
      await supabase.from("profiles").update({ balance: sender.balance }).eq("id", senderId)
      await supabase.from("transactions").delete().eq("id", transaction.id)
      throw recipientError
    }
  }

  // Mark transaction as completed
  const { error: updateError } = await supabase
    .from("transactions")
    .update({ status: "completed" })
    .eq("id", transaction.id)

  if (updateError) throw updateError

  return transaction
}

export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      sender:profiles!transactions_sender_id_fkey(full_name, pay_tag),
      recipient:profiles!transactions_recipient_id_fkey(full_name, pay_tag)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getTransactionById(transactionId: string, userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      sender:profiles!transactions_sender_id_fkey(full_name, pay_tag),
      recipient:profiles!transactions_recipient_id_fkey(full_name, pay_tag)
    `)
    .eq("id", transactionId)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .single()

  if (error) throw error
  return data
}
