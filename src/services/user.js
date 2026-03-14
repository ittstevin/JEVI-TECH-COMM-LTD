const STORAGE_KEY = 'jevitech_user'

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(user) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getUser() {
  return load()
}

export function setUser(values) {
  const existing = load() || {}
  const next = { ...existing, ...values, updatedAt: Date.now() }
  save(next)
  return next
}

export function clearUser() {
  window.localStorage.removeItem(STORAGE_KEY)
}

export function getPaymentHistory() {
  const user = load()
  return user?.payments ?? []
}

export function addPayment(entry) {
  const user = load() || {}
  const payments = [...(user.payments ?? []), entry]
  const next = { ...user, payments, updatedAt: Date.now() }
  save(next)
  return payments
}
