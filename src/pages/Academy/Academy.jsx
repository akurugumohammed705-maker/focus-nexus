import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { GraduationCap, CheckCircle2, Circle, Award, ArrowLeft, PlayCircle, HelpCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import {
  getCourses,
  getCourseWithLessons,
  getMyProgress,
  markLessonComplete,
  issueCertificateIfComplete,
} from '../../services/academyService'

export default function Academy() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCourseId, setActiveCourseId] = useState(null)

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => toast.error('Could not load courses'))
      .finally(() => setLoading(false))
  }, [])

  if (activeCourseId) {
    return (
      <CourseDetail
        courseId={activeCourseId}
        userId={user.id}
        onBack={() => setActiveCourseId(null)}
      />
    )
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-indigo mb-1">Academy</h1>
      <p className="text-muted text-sm mb-7">Courses, quizzes, and certificates.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-muted">No courses published yet.</p>
        ) : (
          courses.map((c) => (
            <div key={c.id} className="bg-white border border-line rounded-brand p-5">
              <div className="w-11 h-11 rounded-xl bg-indigo/10 flex items-center justify-center mb-4">
                <GraduationCap size={20} className="text-indigo" />
              </div>
              <h3 className="font-display text-[15px] font-semibold text-indigo mb-1.5">
                {c.title}
              </h3>
              <p className="text-[13px] text-muted mb-4 line-clamp-3">{c.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted">
                  {c.academy_lessons?.length || 0} lessons
                </span>
                <Button variant="solid" onClick={() => setActiveCourseId(c.id)}>
                  {c.price > 0 ? `GHS ${c.price}` : 'Start free'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}

function CourseDetail({ courseId, userId, onBack }) {
  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [c, p] = await Promise.all([
        getCourseWithLessons(courseId),
        getMyProgress(userId, courseId),
      ])
      setCourse(c)
      setProgress(p)
    } catch (err) {
      toast.error('Could not load course')
    } finally {
      setLoading(false)
    }
  }, [courseId, userId])

  useEffect(() => {
    load()
  }, [load])

  const isDone = (lessonId) =>
    progress.some((p) => p.lesson_id === lessonId && p.status === 'completed')

  const handleComplete = async (lessonId, score = null) => {
    try {
      await markLessonComplete(userId, lessonId, score)
      toast.success('Lesson marked complete')
      setActiveLesson(null)
      await load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleGetCertificate = async () => {
    try {
      const cert = await issueCertificateIfComplete(courseId)
      setCertificate(cert)
      toast.success('Certificate issued!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading || !course) {
    return (
      <DashboardLayout>
        <p className="text-muted text-sm">Loading…</p>
      </DashboardLayout>
    )
  }

  const totalLessons = course.academy_lessons.length
  const completedCount = course.academy_lessons.filter((l) => isDone(l.id)).length
  const allDone = totalLessons > 0 && completedCount === totalLessons

  if (activeLesson) {
    return (
      <DashboardLayout>
        <button
          onClick={() => setActiveLesson(null)}
          className="flex items-center gap-1.5 text-[13.5px] text-muted hover:text-indigo mb-5"
        >
          <ArrowLeft size={15} /> Back to {course.title}
        </button>
        <LessonViewer
          lesson={activeLesson}
          onComplete={(score) => handleComplete(activeLesson.id, score)}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13.5px] text-muted hover:text-indigo mb-5"
      >
        <ArrowLeft size={15} /> All courses
      </button>

      <h1 className="font-display text-2xl font-bold text-indigo mb-1">{course.title}</h1>
      <p className="text-muted text-sm mb-2">{course.description}</p>
      <p className="text-[13px] font-medium text-indigo mb-7">
        {completedCount} of {totalLessons} lessons completed
      </p>

      <div className="bg-white border border-line rounded-brand overflow-hidden mb-6">
        {course.academy_lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => setActiveLesson(lesson)}
            className="w-full flex items-center gap-3 px-5 py-4 border-b border-line last:border-0 text-left hover:bg-black/5"
          >
            {isDone(lesson.id) ? (
              <CheckCircle2 size={18} className="text-green flex-shrink-0" />
            ) : (
              <Circle size={18} className="text-muted flex-shrink-0" />
            )}
            {lesson.content_type === 'quiz' ? (
              <HelpCircle size={16} className="text-gold flex-shrink-0" />
            ) : (
              <PlayCircle size={16} className="text-indigo flex-shrink-0" />
            )}
            <span className="text-[14px] font-medium text-indigo">{lesson.title}</span>
          </button>
        ))}
      </div>

      {allDone && (
        <div className="bg-indigo rounded-brand p-6 text-white flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Award size={22} />
            <div>
              <h3 className="font-display font-semibold">Course complete!</h3>
              <p className="text-white/70 text-[13.5px]">You've finished every lesson.</p>
            </div>
          </div>
          {certificate ? (
            <span className="font-mono text-sm bg-white/10 px-3 py-2 rounded-xl">
              {certificate.certificate_number}
            </span>
          ) : (
            <Button variant="gold" onClick={handleGetCertificate}>
              Get certificate
            </Button>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

function LessonViewer({ lesson, onComplete }) {
  if (lesson.content_type === 'quiz' && lesson.quiz?.questions) {
    return <QuizLesson lesson={lesson} onComplete={onComplete} />
  }

  return (
    <div className="bg-white border border-line rounded-brand p-6 max-w-2xl">
      <h2 className="font-display text-xl font-semibold text-indigo mb-4">{lesson.title}</h2>
      {lesson.video_url ? (
        <div className="aspect-video bg-black/5 rounded-xl mb-5 flex items-center justify-center">
          <a href={lesson.video_url} target="_blank" rel="noreferrer" className="text-indigo underline">
            Watch video
          </a>
        </div>
      ) : (
        <div className="aspect-video bg-black/5 rounded-xl mb-5 flex items-center justify-center text-muted text-sm">
          Video content coming soon
        </div>
      )}
      <Button variant="solid" onClick={() => onComplete(null)}>
        Mark as complete
      </Button>
    </div>
  )
}

function QuizLesson({ lesson, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const questions = lesson.quiz.questions

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }))
  }

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_index) correct++
    })
    const score = Math.round((correct / questions.length) * 100)
    setSubmitted(true)
    setTimeout(() => onComplete(score), 1200)
  }

  return (
    <div className="bg-white border border-line rounded-brand p-6 max-w-2xl">
      <h2 className="font-display text-xl font-semibold text-indigo mb-5">{lesson.title}</h2>
      <div className="space-y-6 mb-6">
        {questions.map((q, i) => (
          <div key={i}>
            <p className="text-[14.5px] font-medium text-indigo mb-2.5">
              {i + 1}. {q.question}
            </p>
            <div className="grid gap-2">
              {q.options.map((opt, j) => {
                const isSelected = answers[i] === j
                const isCorrect = submitted && j === q.correct_index
                const isWrong = submitted && isSelected && j !== q.correct_index
                return (
                  <button
                    key={j}
                    onClick={() => handleSelect(i, j)}
                    className={`text-left px-3.5 py-2.5 rounded-xl border text-[13.5px] transition-colors ${
                      isCorrect
                        ? 'border-green bg-green/10 text-green'
                        : isWrong
                        ? 'border-rust bg-rust/10 text-rust'
                        : isSelected
                        ? 'border-indigo bg-indigo/5 text-indigo'
                        : 'border-line text-ink/80 hover:bg-black/5'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="solid"
        onClick={handleSubmit}
        disabled={submitted || Object.keys(answers).length < questions.length}
      >
        {submitted ? 'Scored — saving…' : 'Submit answers'}
      </Button>
    </div>
  )
}
