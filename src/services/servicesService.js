import { supabase } from '../lib/supabaseClient'

export async function getServices(category = null) {
  let query = supabase.from('services').select('*').eq('is_active', true)
  if (category) query = query.eq('category', category)

  const { data, error } = await query.order('provider').order('price')
  if (error) throw error
  return data
}

export async function purchaseService(serviceId, recipientNumber, quantity = 1) {
  const { data, error } = await supabase.rpc('purchase_service', {
    p_service_id: serviceId,
    p_recipient_number: recipientNumber,
    p_quantity: quantity,
  })

  if (error) throw error
  return data
}

export async function getMyOrders(userId, limit = 20) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items (*, services (name, category, provider))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
