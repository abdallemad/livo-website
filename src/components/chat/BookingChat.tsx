"use client"

/**
 * Booking chat (prototype: assets/js/chat.js): service → date → time → name → address → phone →
 * email → photos → done. Markup and classes match the prototype so livo.css styles it unchanged.
 *
 * After the last answer the chat shows a summary with "Confirm booking": only that click sends the
 * answers (and photos) to POST /api/bookings, which creates the Booking row. The reference shown
 * is the one the server issued; a signed-in visitor sees the booking on their profile right away.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { CONTACT } from "@/constants/site"
import { SERVICES, TOWNS, type Service } from "@/data/services"
import { localePath, pick } from "@/i18n/translate"
import { useAccountActions } from "@/hooks/use-session"
import { apiFetch } from "@/lib/api-client"
import type { BookingDto } from "@/services/booking.service"
import { getService, serviceIconSrc, serviceSearchText } from "@/utils/services"
import { CHAT_COPY, fill, type ChatCopy } from "./chat-copy"

export type ChatPreset = string | { text: string }

const STEPS = ["service", "date", "time", "name", "address", "phone", "email", "photos"] as const
type Step = (typeof STEPS)[number] | "confirm" | "final"

type Picked = Service | { custom: string }
interface Answers {
  ref: string
  any?: boolean
  service?: Picked
  date?: string
  time?: string
  name?: string
  address?: string
  phone?: string
  contact?: string
  email?: string
  photos?: File[]
}

type NewMsg = { kind: "bot" | "me" | "typing"; text: string } | { kind: "summary"; answers: Answers } | { kind: "done"; answers: Answers }
type Msg = NewMsg & { id: number }

const isService = (s: Picked | undefined): s is Service => !!s && "id" in s

export function BookingChat({ session, onClose }: { session: { id: number; preset: ChatPreset } | null; onClose: () => void }) {
  const { lang, t: tr } = useLang()
  const { refreshBookings } = useAccountActions()
  const c: ChatCopy = CHAT_COPY[lang]
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [step, setStep] = useState<Step | null>(null)
  const [progress, setProgress] = useState(0)
  const [anyMode, setAnyMode] = useState(false)
  const ans = useRef<Answers>({ ref: "" })
  const timers = useRef<number[]>([])
  const msgId = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const open = !!session

  const sname = (s?: Picked) => (s ? (isService(s) ? pick(lang, s.name) : s.custom) : "")
  const day = (iso: string) => new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso + "T12:00:00"))

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  const push = (m: NewMsg) => {
    const id = ++msgId.current
    setMsgs((list) => [...list, { ...m, id }])
    return id
  }
  const me = (text: string) => push({ kind: "me", text })
  const bot = (text: string, cb?: () => void, ms?: number) => {
    const id = push({ kind: "typing", text: "" })
    later(() => {
      setMsgs((list) => list.map((m) => (m.id === id ? { id, kind: "bot", text } : m)))
      cb?.()
    }, ms ?? Math.min(450 + text.length * 9, 1100))
  }
  const go = (i: number) => {
    setProgress(i)
    if (i < STEPS.length) return setStep(STEPS[i])
    // all answered: show the summary; nothing is saved until "Confirm booking"
    setStep("confirm")
    push({ kind: "summary", answers: { ...ans.current } })
  }

  const confirm = () => {
    setStep(null)
    me(c.confirmMe)
    finish()
  }
  const ask = (k: "name" | "addr" | "phone" | "email" | "photos", cb: () => void) => bot(c[k], cb)

  const pickService = (s: Picked, label?: string) => {
    ans.current.service = s
    me(label || sname(s))
    setStep(null)
    bot(fill(c.svcReact, { a: sname(s) }), () => bot(c.date, () => go(1)), 450)
  }

  function finish() {
    const a = ans.current
    const service = a.service
    const fd = new FormData()
    const put = (k: string, v?: string) => v && fd.set(k, v)
    if (isService(service)) put("service", service.id)
    else put("customService", sname(service))
    put("date", a.date)
    put("time", a.time)
    put("name", a.name)
    put("address", a.address)
    put("phone", a.phone)
    put("contact", a.contact)
    put("email", a.email)
    fd.set("locale", lang)
    for (const file of a.photos ?? []) fd.append("photos", file)
    const wait = push({ kind: "typing", text: "" })
    apiFetch<BookingDto>("/api/bookings", { method: "POST", body: fd })
      .then((created) => {
        a.ref = created.ref
        setMsgs((list) => list.filter((m) => m.id !== wait))
        push({ kind: "done", answers: { ...a } })
        setStep("final")
        refreshBookings()
      })
      .catch(() => {
        setMsgs((list) => list.map((m) => (m.id === wait ? { id: wait, kind: "bot", text: fill(c.sendErr, { p: CONTACT.phoneDisplay }) } : m)))
        setStep("confirm") // try again
      })
  }

  // start a new conversation every time the chat is opened
  useEffect(() => {
    if (!session) return
    timers.current.forEach(clearTimeout)
    timers.current = []
    lastFocus.current = document.activeElement as HTMLElement
    ans.current = { ref: `LV-${1000 + Math.floor(Math.random() * 9000)}` }
    /* eslint-disable react-hooks/set-state-in-effect -- the conversation is (re)started by the open request */
    setMsgs([])
    setStep(null)
    setProgress(0)
    setAnyMode(session.preset === "any")
    /* eslint-enable react-hooks/set-state-in-effect */
    const preset = session.preset
    let pre: Picked | null = null
    let label: string | null = null
    if (preset && typeof preset === "object" && preset.text) {
      const q = preset.text.toLowerCase()
      label = preset.text
      pre = SERVICES.find((s) => serviceSearchText(s, false).includes(q)) ?? { custom: preset.text }
    } else if (preset === "free-inspection") pre = { custom: c.inspect }
    else if (preset === "any") ans.current.any = true
    else if (typeof preset === "string" && preset) pre = getService(preset) ?? null

    bot(ans.current.any ? c.anyHello : c.hello, () => {
      if (pre) {
        ans.current.service = pre
        me(label || `${isService(pre) ? pre.emoji + " " : ""}${sname(pre)}`)
        bot(fill(c.svcReact, { a: sname(pre) }), () => bot(c.date, () => go(1)), 450)
      } else go(0)
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restart only for a new open request
  }, [session?.id])

  useEffect(() => {
    if (!open) return
    document.body.classList.add("lock")
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.classList.remove("lock")
      document.removeEventListener("keydown", onKey)
      timers.current.forEach(clearTimeout)
      lastFocus.current?.focus?.()
    }
  }, [open, onClose])

  useEffect(() => {
    const el = listRef.current
    if (el) later(() => (el.scrollTop = el.scrollHeight), 30)
  }, [msgs])

  if (!session) return null

  return (
    <div className="chat open" id="chat" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cd" role="dialog" aria-modal="true" aria-label="LIVO">
        <div className="ch">
          <img src="/img/mark.png" alt="" />
          <div>
            <b>LIVO</b>
            <small id="chst">{c.status}</small>
          </div>
          <button className="cx" type="button" aria-label={c.close} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="cm" aria-live="polite" ref={listRef}>
          {msgs.map((m) =>
            m.kind === "typing" ? (
              <div key={m.id} className="b bot ty">
                <i />
                <i />
                <i />
              </div>
            ) : m.kind === "summary" ? (
              <Summary key={m.id} c={c} a={m.answers} sname={sname} day={day} />
            ) : m.kind === "done" ? (
              <Done key={m.id} c={c} a={m.answers} sname={sname} day={day} />
            ) : (
              <div key={m.id} className={`b ${m.kind}`}>
                {m.text}
              </div>
            ),
          )}
        </div>
        <div className="cp" style={{ gridTemplateColumns: `repeat(${STEPS.length},1fr)` }}>
          {STEPS.map((s, i) => (
            <i key={s} className={i < progress ? "on" : undefined} />
          ))}
        </div>
        <div className="ci">
          <StepInput
            key={`${session.id}-${step}`}
            step={step}
            c={c}
            any={anyMode}
            onService={(v) => {
              if (ans.current.any) return pickService({ custom: v }, v)
              const q = v.toLowerCase()
              pickService(SERVICES.find((s) => serviceSearchText(s).includes(q)) ?? { custom: v }, v)
            }}
            onServiceChip={(s) => pickService(s, `${s.emoji} ${pick(lang, s.name)}`)}
            onDate={(v) => {
              ans.current.date = v
              setStep(null)
              if (v === "ASAP") {
                ans.current.time = ""
                me(c.asap)
                bot(c.dateReact, () => ask("name", () => go(3)))
              } else {
                me(day(v))
                bot(c.dateReact, () => bot(c.time, () => go(2)), 500)
              }
            }}
            onTime={(v) => {
              ans.current.time = v
              me(v || c.laterMe)
              setStep(null)
              bot(c.timeReact, () => ask("name", () => go(3)))
            }}
            onName={(v) => {
              ans.current.name = v
              me(v)
              setStep(null)
              bot(c.addr, () => go(4))
            }}
            onAddress={(v) => {
              ans.current.address = v
              me(v)
              setStep(null)
              bot(c.addrReact, () => ask("phone", () => go(5)), 450)
            }}
            onPhone={(phone, pref, prefLabel) => {
              ans.current.phone = phone
              ans.current.contact = pref
              me(`${phone} · ${prefLabel}`)
              setStep(null)
              bot(c.phoneReact, () => ask("email", () => go(6)), 450)
            }}
            onEmail={(v) => {
              ans.current.email = v
              me(v)
              setStep(null)
              ask("photos", () => go(7))
            }}
            onPhotos={(files) => {
              const n = files.length
              ans.current.photos = files
              me(n ? `📷 ${fill(c.attached, { n })}` : c.skipMe)
              setStep(null)
              go(STEPS.length)
            }}
            onClose={onClose}
            onConfirm={confirm}
            termsHref={localePath(lang, "/terms")}
            privacyHref={localePath(lang, "/privacy")}
            phoneLabels={["WhatsApp", tr("Phone", "Téléphone", "Telefon"), tr("Email", "Email", "E-Mail")]}
          />
        </div>
      </div>
    </div>
  )
}

type SummaryProps = { c: ChatCopy; a: Answers; sname: (s?: Picked) => string; day: (iso: string) => string }

function SummaryRows({ c, a, sname, day }: SummaryProps) {
  const when = (a.date === "ASAP" ? c.asap : a.date ? day(a.date) : "—") + (a.time ? ` · ${a.time}` : "")
  const row = (label: string, value: ReactNode) => (
    <div>
      <b>{label}: </b>
      {value}
    </div>
  )
  return (
    <div className="sum">
      {row(c.lblS, sname(a.service) || "—")}
      {row(c.lblD, when)}
      {row(c.lblN, a.name || "—")}
      {row(c.lblA, a.address || "—")}
      {row(c.lblP, a.phone || "—")}
    </div>
  )
}

/** Before anything is saved: the answers to check, confirmed with the button under the chat. */
function Summary(props: SummaryProps) {
  return (
    <div className="done">
      <h3>{props.c.checkT}</h3>
      <p>{props.c.checkS}</p>
      <SummaryRows {...props} />
    </div>
  )
}

function Done(props: SummaryProps) {
  const { c, a } = props
  return (
    <div className="done">
      <div className="ok">✓</div>
      <h3>{c.doneT}</h3>
      <p>{c.doneS}</p>
      <SummaryRows {...props} />
      <div className="pv-note">{fill(c.note, { p: CONTACT.phoneDisplay, r: a.ref })}</div>
    </div>
  )
}

/* ---------------- step inputs ---------------- */

interface StepInputProps {
  step: Step | null
  c: ChatCopy
  any: boolean
  onService: (v: string) => void
  onServiceChip: (s: Service) => void
  onDate: (v: string) => void
  onTime: (v: string) => void
  onName: (v: string) => void
  onAddress: (v: string) => void
  onPhone: (phone: string, pref: string, prefLabel: string) => void
  onEmail: (v: string) => void
  onPhotos: (files: File[]) => void
  onClose: () => void
  onConfirm: () => void
  termsHref: string
  privacyHref: string
  phoneLabels: [string, string, string]
}

/** Focus the first text field of a step, except on touch devices (keyboard would jump up). */
function useAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    if ("ontouchstart" in window) return
    const id = setTimeout(() => ref.current?.focus(), 60)
    return () => clearTimeout(id)
  }, [])
  return ref
}

function StepInput(p: StepInputProps) {
  switch (p.step) {
    case "service":
      return <ServiceStep {...p} />
    case "date":
      return <DateStep {...p} />
    case "time":
      return <TimeStep {...p} />
    case "name":
      return (
        <TextStep
          c={p.c}
          type="text"
          autoComplete="name"
          placeholder={p.c.namePh}
          label={p.c.name}
          error={p.c.nameErr}
          valid={(v) => /\S+\s+\S+/.test(v.trim()) && v.trim().length > 4}
          onDone={p.onName}
        />
      )
    case "address":
      return <AddressStep {...p} />
    case "phone":
      return <PhoneStep {...p} />
    case "email":
      return (
        <TextStep
          c={p.c}
          type="email"
          autoComplete="email"
          placeholder={p.c.emailPh}
          label={p.c.email}
          error={p.c.emailErr}
          valid={(v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())}
          onDone={p.onEmail}
        />
      )
    case "photos":
      return <PhotosStep {...p} />
    case "confirm":
      return (
        <>
          <button className="big" type="button" onClick={p.onConfirm}>
            {p.c.confirm}
          </button>
          <button className="alt" type="button" onClick={p.onClose}>
            {p.c.cancel}
          </button>
        </>
      )
    case "final":
      return (
        <>
          <a className="big" style={{ textAlign: "center", textDecoration: "none" }} href={CONTACT.whatsapp} target="_blank" rel="noopener">
            {`💬 ${p.c.wa}`}
          </a>
          <button className="alt" type="button" onClick={p.onClose}>
            {p.c.close}
          </button>
        </>
      )
    default:
      return null
  }
}

function ServiceStep({ c, any, onService, onServiceChip }: StepInputProps) {
  const { pick: pk } = useLang()
  const [v, setV] = useState("")
  const ref = useAutoFocus<HTMLInputElement>()
  const submit = () => v.trim() && onService(v.trim())
  return (
    <>
      <div className="row">
        <input
          ref={ref}
          type="text"
          placeholder={any ? c.anyPh : c.svcPh}
          aria-label={any ? c.anyHello : c.hello}
          autoComplete="off"
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button className="go" type="button" aria-label="OK" onClick={submit}>
          ➤
        </button>
      </div>
      {!any && (
        <div className="cc">
          {SERVICES.map((s) => (
            <button key={s.id} type="button" onClick={() => onServiceChip(s)}>
              <img className="ico" src={serviceIconSrc(s.id)} alt="" width="22" height="22" data-em={s.emoji} />
              {pk(s.name)}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

function DateStep({ c, onDate }: StepInputProps) {
  const [v, setV] = useState("")
  const ref = useRef<HTMLInputElement>(null)
  const [min] = useState(() => new Date().toISOString().slice(0, 10))
  return (
    <>
      <input ref={ref} type="date" min={min} aria-label={c.confirmDate} value={v} onChange={(e) => setV(e.target.value)} />
      <button className="big" type="button" onClick={() => (v ? onDate(v) : ref.current?.focus())}>
        {c.confirmDate}
      </button>
      <button className="alt" type="button" onClick={() => onDate("ASAP")}>
        {c.asap}
      </button>
    </>
  )
}

function TimeStep({ c, onTime }: StepInputProps) {
  const [v, setV] = useState("10:00")
  return (
    <>
      <input type="time" aria-label={c.confirmTime} value={v} onChange={(e) => setV(e.target.value)} />
      <button className="big" type="button" onClick={() => onTime(v)}>
        {c.confirmTime}
      </button>
      <button className="alt" type="button" onClick={() => onTime("")}>
        {c.later}
      </button>
    </>
  )
}

function TextStep(props: {
  c: ChatCopy
  type: "text" | "email"
  autoComplete: string
  placeholder: string
  label: string
  error: string
  valid: (v: string) => boolean
  onDone: (v: string) => void
}) {
  const [v, setV] = useState("")
  const [err, setErr] = useState("")
  const ref = useAutoFocus<HTMLInputElement>()
  const submit = () => (props.valid(v) ? props.onDone(v.trim()) : setErr(props.error))
  return (
    <>
      <div className="row">
        <input
          ref={ref}
          type={props.type}
          placeholder={props.placeholder}
          aria-label={props.label}
          autoComplete={props.autoComplete}
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button className="go" type="button" aria-label="OK" onClick={submit}>
          ➤
        </button>
      </div>
      <div className="cerr">{err}</div>
    </>
  )
}

function AddressStep({ c, onAddress }: StepInputProps) {
  const [v, setV] = useState("")
  const [err, setErr] = useState("")
  const ref = useAutoFocus<HTMLInputElement>()
  const q = v.toLowerCase().split(",").pop()!.trim()
  const towns = TOWNS.filter((x) => !q || x.toLowerCase().includes(q)).slice(0, 6)
  const submit = () => (v.trim().length < 4 ? setErr(c.addrErr) : onAddress(v.trim()))
  return (
    <>
      <input
        ref={ref}
        type="text"
        placeholder={c.addrPh}
        aria-label={c.addr}
        autoComplete="street-address"
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <div className="cc">
        {towns.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => {
              setV((cur) => (cur.includes(",") ? cur.split(",")[0] + ", " : "") + x)
              ref.current?.focus()
            }}
          >
            {`📍 ${x}`}
          </button>
        ))}
      </div>
      <div className="cerr">{err}</div>
      <button className="big" type="button" onClick={submit}>
        {c.confirmAddr}
      </button>
    </>
  )
}

const PREFS = ["WhatsApp", "Phone", "Email"] as const

function PhoneStep({ c, onPhone, termsHref, privacyHref, phoneLabels }: StepInputProps) {
  const [v, setV] = useState("+352 ")
  const [pref, setPref] = useState(0)
  const [agree, setAgree] = useState(false)
  const [err, setErr] = useState("")
  const ref = useAutoFocus<HTMLInputElement>()
  const submit = () => {
    if (v.replace(/\D/g, "").length < 8) return setErr(c.phoneErr)
    if (!agree) return setErr(c.consentErr)
    onPhone(v.trim(), PREFS[pref], PREFS[pref])
  }
  const consent = c.consent.split(/(\{t\}|\{p\})/).map((part, i) =>
    part === "{t}" ? (
      <a key={i} href={termsHref} target="_blank" rel="noopener">
        {c.terms}
      </a>
    ) : part === "{p}" ? (
      <a key={i} href={privacyHref} target="_blank" rel="noopener">
        {c.privacy}
      </a>
    ) : (
      part
    ),
  )
  return (
    <>
      <input ref={ref} type="tel" placeholder={c.phonePh} aria-label={c.phone} autoComplete="tel" value={v} onChange={(e) => setV(e.target.value)} />
      <div className="seg" role="group" aria-label={c.pref}>
        {phoneLabels.map((n, i) => (
          <button key={i} type="button" className={i === pref ? "on" : undefined} onClick={() => setPref(i)}>
            {n}
          </button>
        ))}
      </div>
      <label className="chk" htmlFor="chcb">
        <input type="checkbox" id="chcb" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>{consent}</span>
      </label>
      <div className="cerr">{err}</div>
      <button className="big" type="button" onClick={submit}>
        {c.send}
      </button>
    </>
  )
}

function PhotosStep({ c, onPhotos }: StepInputProps) {
  const [files, setFiles] = useState<{ file: File; url: string }[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const urls = useRef<string[]>([])
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), [])
  const add = useCallback((list: FileList | null) => {
    if (!list) return
    const next = Array.from(list).map((f) => {
      const url = URL.createObjectURL(f)
      urls.current.push(url)
      return { file: f, url }
    })
    setFiles((cur) => [...cur, ...next])
  }, [])
  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        aria-label={c.upload}
        onChange={(e) => {
          add(e.target.files)
          e.target.value = ""
        }}
      />
      <div className="thumbs">
        {files.map((f) => (
          <img key={f.url} src={f.url} alt="" />
        ))}
      </div>
      <div className="pv-note">{files.length ? fill(c.attached, { n: files.length }) : ""}</div>
      <button className="big" type="button" onClick={() => fileRef.current?.click()}>
        {files.length ? `＋ ${c.add}` : `📷 ${c.upload}`}
      </button>
      <button className="big" type="button" style={files.length ? undefined : { display: "none" }} onClick={() => onPhotos(files.map((f) => f.file))}>
        {c.cont}
      </button>
      <button className="alt" type="button" style={files.length ? { display: "none" } : undefined} onClick={() => onPhotos([])}>
        {c.skip}
      </button>
    </>
  )
}
