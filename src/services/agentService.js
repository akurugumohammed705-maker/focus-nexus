import { supabase } from '../lib/supabaseClient'

function generateAgentCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no O/0/I/1 to avoid confusion
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `AGT-${code}`
}

// ---------- agents ----------

export async function getMyAgent(userId) {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function activateAgent(userId, commissionRate = 3.0) {
  const { data, error } = await supabase
    .from('agents')
    .insert({
      user_id: userId,
      agent_code: generateAgentCode(),
      commission_rate: commissionRate,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSubAgentsForAgent(agentId) {
  const { data, error } = await supabase
    .from('sub_agents')
    .select('*, profiles:user_id (full_name, phone)')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// ---------- sub-agents ----------

export async function getMySubAgentRecord(userId) {
  const { data, error } = await supabase
    .from('sub_agents')
    .select('*, agents:agent_id (agent_code, user_id, profiles:user_id (full_name))')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function joinAgentByCode(userId, code, commissionRate = 1.5) {
  const { data: agent, error: lookupError } = await supabase
    .from('agents')
    .select('id, status')
    .eq('agent_code', code.trim().toUpperCase())
    .maybeSingle()

  if (lookupError) throw lookupError
  if (!agent) throw new Error('No agent found with that code — double-check and try again')
  if (agent.status !== 'active') throw new Error('This agent account is not currently active')

  const { data, error } = await supabase
    .from('sub_agents')
    .insert({
      user_id: userId,
      agent_id: agent.id,
      commission_rate: commissionRate,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// ---------- commissions (shared by agents and sub-agents) ----------

export async function getCommissions(earnerId) {
  const { data, error } = await supabase
    .from('commissions')
    .select('*')
    .eq('earner_id', earnerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
