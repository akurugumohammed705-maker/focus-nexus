import { supabase } from '../lib/supabaseClient'

export async function getCourses() {
  const { data, error } = await supabase
    .from('academy_courses')
    .select('*, academy_lessons (id)')
    .eq('is_published', true)
    .order('created_at')

  if (error) throw error
  return data
}

export async function getCourseWithLessons(courseId) {
  const { data, error } = await supabase
    .from('academy_courses')
    .select('*, academy_lessons (*)')
    .eq('id', courseId)
    .single()

  if (error) throw error
  data.academy_lessons.sort((a, b) => a.order_index - b.order_index)
  return data
}

export async function getMyProgress(userId, courseId) {
  const { data, error } = await supabase
    .from('academy_progress')
    .select('*, academy_lessons!inner (course_id)')
    .eq('user_id', userId)
    .eq('academy_lessons.course_id', courseId)

  if (error) throw error
  return data
}

export async function markLessonComplete(userId, lessonId, score = null) {
  const { data, error } = await supabase
    .from('academy_progress')
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        status: 'completed',
        score,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function issueCertificateIfComplete(courseId) {
  const { data, error } = await supabase.rpc('issue_certificate_if_complete', {
    p_course_id: courseId,
  })

  if (error) throw error
  return data
}

export async function getMyCertificates(userId) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, academy_courses (title)')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })

  if (error) throw error
  return data
}
