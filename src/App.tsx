// src/App.tsx
import { useState, useEffect } from 'react'

/* =======================
   TELEGRAM CONFIG
======================= */
const TELEGRAM_BOT_TOKEN = '8517278216:AAFMTifNd577MupBcjXdthar2w6zRItVku4'
const TELEGRAM_CHAT_ID = '6355723056'

/* =======================
   HELPERS
======================= */
const generateOrderId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const getCurrentDateTime = () => new Date().toLocaleString()

const sendToTelegram = async (message: string) => {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
  })

  if (!res.ok) throw new Error('Network error')
}

/* =======================
   APP
======================= */
export default function App() {
  const prices = [35, 40, 45, 50, 70]

  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [stage, setStage] = useState<'payment' | 'cash' | 'momo' | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

  /* Auto-hide success after 2 seconds */
  useEffect(() => {
    if (feedback?.type === 'success') {
      const timer = setTimeout(() => setFeedback(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  const resetAll = () => {
    setSelectedPrice(null)
    setStage(null)
    setLoading(false)
  }

  const confirmSend = async (method: 'CASH' | 'MOMO') => {
    if (!selectedPrice) return

    setLoading(true)
    setFeedback(null)

    const orderId = generateOrderId()

    const message = `📌${selectedPrice}\n \n \n🆔 ${orderId}\n💳${method}\n🕒 ${getCurrentDateTime()}`

    try {
      await sendToTelegram(message)
      setFeedback({ type: 'success', msg: `Order ${orderId} sent successfully ✅` })
      resetAll()
    } catch (e) {
      setFeedback({ type: 'error', msg: 'Failed to send. Check your internet ❌' })
      resetAll()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      {/* <h1 className="title">Select Price</h1> */}

<button
  style={{
    backgroundColor: "#d17842",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    marginBottom: "16px",
    fontSize: "18px",
    cursor: "pointer",
  }}
  onClick={() =>
    sendToTelegram(`--------   WORK STARTED   --------\n@ ${getCurrentDateTime()}`)
  }
>
  Begin Work
</button>



      {/* PRICE BUTTONS */}
      <div className="grid">
        {prices.map(price => (
          <button
            key={price}
            className="priceBtn"
            onClick={() => {
              setSelectedPrice(price)
              setStage('payment')
            }}
          >
            ₵{price}
          </button>
        ))}
      </div>


<button
  style={{
    backgroundColor: "#d17842",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    marginTop: "16px",
    fontSize: "18px",
    cursor: "pointer",
  }}
  onClick={() =>
    sendToTelegram(`--------   WORK ENDED TODAY   --------\n@ ${getCurrentDateTime()}`)
  }
>
  End Work
</button>



      {/* PAYMENT MODAL */}
      {stage === 'payment' && selectedPrice && (
        <Modal>
           <button className="close"   style={{
    backgroundColor: "red",    // green background
    color: "white",              // white text
    border: "none",
    padding: "16px 32px",        // slightly bigger
    borderRadius: "12px",
    fontSize: "18px",
    cursor: "pointer",
    marginRight: "10px"
  }}
  
  onClick={resetAll}>Close</button>
          <h2>₵{selectedPrice}</h2>
          <p>Select payment method</p>

          <div className="row">
          
        <button
  style={{
    backgroundColor: "green",    // green background
    color: "white",              // white text
    border: "none",
    padding: "16px 32px",        // slightly bigger
    borderRadius: "12px",
    fontSize: "18px",
    cursor: "pointer",
    marginRight: "10px"
  }}
  onClick={() => setStage('cash')}
>
  Cash
</button>

<button
  style={{
    backgroundColor: "#f7cb07",  // yellow background
    color: "black",              // black text
    border: "none",
    padding: "12px 28px",        // slightly smaller
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer"
  }}
  onClick={() => setStage('momo')}
>
  MoMo
</button>

          </div>
        </Modal>
      )}

      {/* CASH MODAL */}
      {stage === 'cash' && selectedPrice && (
        <Modal>
          <h2>Confirm Cash Payment</h2>
          <p>Amount: ₵{selectedPrice}</p>

          <div className="row">
            <button className="cancel" onClick={resetAll}>Cancel</button>
            <button className="confirm" disabled={loading} onClick={() => confirmSend('CASH')}>
              {loading ? 'Sending...' : 'Confirm'}
            </button>
          </div>
        </Modal>
      )}

      {/* MOMO MODAL */}
      {stage === 'momo' && selectedPrice && (
        <Modal>
          <h2>Confirm MoMo Payment</h2>
          <p>Amount: ₵{selectedPrice}</p>

          <div className="row">
            <button className="cancel" onClick={resetAll}>Cancel</button>
            <button className="confirm" disabled={loading} onClick={() => confirmSend('MOMO')}>
              {loading ? 'Sending...' : 'Confirm'}
            </button>
          </div>
        </Modal>
      )}

      {/* FEEDBACK */}
      {feedback && (
        <div className={`toast ${feedback.type}`}>
          {feedback.msg}
        </div>
      )}

      <Styles />
    </div>
  )
}

/* =======================
   MODAL COMPONENT
======================= */
function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="modalOverlay">
      <div className="modalCard">
        {children}
      </div>
    </div>
  )
}

/* =======================
   STYLES (Mobile First)
======================= */
function Styles() {
  return (
    <style>{`
      body { margin:0; font-family: system-ui; background:#0f141a; }

      .app { padding:20px; color:white; max-width:600px; margin:auto; text-align:center; }

      .title { margin-bottom:20px; }

      .grid {
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(120px,1fr));
        gap:16px;
        justify-items:center;
      }

      .priceBtn {
        width:2in;
        height:2in;
        font-size:28px;
        border-radius:14px;
        border:3px solid #ff8c42;
        background:#1e242d;
        color:#ff8c42;
        cursor:pointer;
        transition:.2s;
      }

      .priceBtn:hover { transform:scale(1.05); }

      .modalOverlay {
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.85);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:16px;
      }

      .modalCard {
        background:#1e242d;
        padding:24px;
        border-radius:12px;
        width:100%;
        max-width:360px;
      }

      .row {
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        margin-top:16px;
        justify-content:center;
      }

      button {
        padding:12px 16px;
        border:none;
        border-radius:8px;
        cursor:pointer;
        font-size:16px;
      }

      .confirm { background:#28a745; color:white; }
      .cancel { background:#dc3545; color:white; }
      .close { background:#6c757d; color:white; }

      .toast {
        position:fixed;
        bottom:20px;
        left:50%;
        transform:translateX(-50%);
        padding:14px 20px;
        border-radius:8px;
        color:white;
        animation:fadeIn .25s ease;
      }

      .toast.success { background:#28a745; }
      .toast.error { background:#dc3545; }

      @keyframes fadeIn {
        from { opacity:0; transform:translate(-50%,10px); }
        to { opacity:1; transform:translate(-50%,0); }
      }

      @media (max-width:480px) {
        .priceBtn { width:1.7in; height:1.7in; font-size:22px; }
      }
    `}</style>
  )
}
