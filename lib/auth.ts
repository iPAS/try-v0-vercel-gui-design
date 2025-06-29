import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

export async function signUp(email: string, password: string, fullName: string, payTag: string, pin: string) {
  // Check if PayTag is already taken
  const { data: existingUser } = await supabase.from("profiles").select("pay_tag").eq("pay_tag", payTag).single()

  if (existingUser) {
    throw new Error("PayTag is already taken")
  }

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  if (authData.user) {
    // Hash the PIN
    const pinHash = await bcrypt.hash(pin, 10)

    // Create user profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      pay_tag: payTag,
      pin_hash: pinHash,
      balance: 1000.0, // Starting balance for demo
    })

    if (profileError) throw profileError
  }

  return authData
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function verifyPin(userId: string, pin: string) {
  const { data: profile } = await supabase.from("profiles").select("pin_hash").eq("id", userId).single()

  if (!profile) throw new Error("User not found")

  return bcrypt.compare(pin, profile.pin_hash)
}

export async function findUserByPayTag(payTag: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, pay_tag, avatar_url")
    .eq("pay_tag", payTag)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data
}
