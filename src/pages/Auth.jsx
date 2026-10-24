import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { DISTRICTS } from '../data'
import { useApp } from '../store'

// Giriş və qeydiyyat — bir səhifə, iki rejim
export default function Auth({ mode = 'login' }) {
  const { login, register, me, notify } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/'
  const isLogin = mode === 'login'

  const [form, setForm] = useState({ name: '', email: '', password: '', district: '' })
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (me) return <Navigate to={next} replace />

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = isLogin
        ? await login(form.email.trim(), form.password)
        : await register({ name: form.name.trim(), email: form.email.trim(), password: form.password, district: form.district || undefined })
      notify(isLogin ? `Xoş gəldin, ${user.name.split(' ')[0]}` : 'Hesabın yaradıldı')
      navigate(next, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const fillDemo = () => setForm((f) => ({ ...f, email: 'sakina@relove.demo', password: 'parol123' }))
  const otherLink = `${isLogin ? '/qeydiyyat' : '/giris'}${params.get('next') ? `?next=${encodeURIComponent(next)}` : ''}`

  return (
    <div className="container auth">
      <div className="auth-card">
        <p className="auth-eyebrow">Relove</p>
        <h1 className="auth-title">{isLogin ? 'Hesabına daxil ol' : 'Hesab yarat'}</h1>
        <p className="auth-lead">
          {isLogin ? 'Bəyəndiklərin, mesajların və elanların səni gözləyir.' : 'Əşyalarını paylaş, dəyiş və bəyəndiklərini saxla.'}
        </p>

        <form className="auth-form" onSubmit={submit} noValidate>
          {!isLogin && (
            <label className="field">
              <span>Ad və soyad</span>
              <input value={form.name} onChange={set('name')} autoComplete="name" required minLength={2} />
            </label>
          )}
          <label className="field">
            <span>E-poçt</span>
            <input type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
          </label>
          <label className="field">
            <span>Parol {!isLogin && <small>(ən azı 8 simvol)</small>}</span>
            <span className="auth-pass">
              <input
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Parolu gizlət' : 'Parolu göstər'}>
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          {!isLogin && (
            <label className="field">
              <span>Ərazi <small>(istəyə bağlı)</small></span>
              <select value={form.district} onChange={set('district')}>
                <option value="">Seç</option>
                {DISTRICTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={busy}>
            {busy ? 'Gözlə…' : isLogin ? 'Daxil ol' : 'Hesab yarat'} {!busy && <ArrowRight size={17} />}
          </button>
        </form>

        {isLogin && (
          <button type="button" className="auth-demo" onClick={fillDemo}>
            Demo hesabla yoxla: <strong>sakina@relove.demo</strong> · parol123
          </button>
        )}

        <p className="auth-switch">
          {isLogin ? 'Hesabın yoxdur?' : 'Artıq hesabın var?'} <Link to={otherLink}>{isLogin ? 'Qeydiyyatdan keç' : 'Daxil ol'}</Link>
        </p>
      </div>
    </div>
  )
}
