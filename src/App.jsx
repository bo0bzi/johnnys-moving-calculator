import { useState } from 'react'
import './App.css'

function to12HourString(hour, minute, period) {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
}

function parse12HourTime(timeStr) {
  // e.g., '09:30 AM' or '01:00 PM'
  const [time, period] = timeStr.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h + m / 60;
}

const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const minuteOptions = ['00', '15', '30', '45'];
const periodOptions = ['AM', 'PM'];

function App() {
  // State variables
  const [workers, setWorkers] = useState('Two men');
  // Grouped time selection state
  const [startHour, setStartHour] = useState('09');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState('AM');
  const [endHour, setEndHour] = useState('01');
  const [endMinute, setEndMinute] = useState('30');
  const [endPeriod, setEndPeriod] = useState('PM');
  const [driveTime, setDriveTime] = useState(0.5);

  // Combine to time string for calculation
  const startTime = to12HourString(startHour, startMinute, startPeriod);
  const endTime = to12HourString(endHour, endMinute, endPeriod);

  // Calculate total hours FIRST
  const start = parse12HourTime(startTime);
  const end = parse12HourTime(endTime);
  let moveTime = end - start;
  let totalHours = moveTime + Number(driveTime);
  const timeError = end <= start;
  if (totalHours < 0) totalHours = 0;
  if (moveTime < 0) moveTime = 0;

  // Pricing rules
  const isTwoMen = workers === 'Two men';
  const isThreeMen = workers === 'Three men';
  const minHours = 3;
  const minCharge = isTwoMen ? 500 : isThreeMen ? 600 : 0;
  const extraRate = isTwoMen ? 140 : isThreeMen ? 180 : 0;
  // Per 0.25 hour rates (explicitly set)
  const quarterHourRate = isTwoMen ? 35 : isThreeMen ? 45 : 0;

  let subtotal = 0;
  let extraTime = 0;
  let extraIncrements = 0;
  let breakdown = '';
  if (totalHours <= minHours) {
    subtotal = minCharge;
    breakdown = `Minimum charge (covers first ${minHours.toFixed(1)} hrs): $${minCharge.toFixed(2)}`;
  } else {
    // Calculate number of 0.25 hour increments, rounded up
    extraTime = totalHours - minHours;
    extraIncrements = Math.ceil(extraTime / 0.25);
    subtotal = minCharge + extraIncrements * quarterHourRate;
    breakdown = `Minimum charge (covers first ${minHours.toFixed(1)} hrs): $${minCharge.toFixed(2)}\n` +
      `Extra time: ${extraTime.toFixed(1)} hrs (${extraIncrements} × 0.25 hr at $${quarterHourRate} per 0.25 hr): $${(extraIncrements * quarterHourRate).toFixed(2)}`;
  }

  const taxedTotal = subtotal * 1.13;
  const ccTotal = taxedTotal * 1.05;

  // Export to CSV
  const handleExportCSV = () => {
    const csvRows = [
      ['Workers', workers],
      ['Start Time', startTime],
      ['End Time', endTime],
      ['Drive Time (hrs)', driveTime],
      ['Total Hours', totalHours.toFixed(2)],
      ['Subtotal', subtotal.toFixed(2)],
      ['Taxed Total (13%)', taxedTotal.toFixed(2)],
      ['Total with CC Fee (5%)', ccTotal.toFixed(2)],
    ]
    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'job-estimate.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <div className="header">
        <img src="/JM.png" alt="Johnny's Moving Logo" className="logo" />
        <div style={{ fontSize: '0.7rem', color: '#bbb', marginTop: '-0.5rem', marginBottom: '0.5rem', letterSpacing: '0.03em' }}>Micro Penis Industries</div>
        <h1>Johnny's Moving & Delivery - Job Cost Calculator</h1>
      </div>
      <form className="calculator-form" onSubmit={e => e.preventDefault()}>
        <h2>Job Details</h2>
        <label htmlFor="workers">
          Worker Selection:
          <select id="workers" value={workers} onChange={e => setWorkers(e.target.value)}>
            <option>Two men</option>
            <option>Three men</option>
            <option>Four men</option>
          </select>
        </label>
        <label htmlFor="startTimeGroup">
          Start Time:
          <div id="startTimeGroup" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select value={startHour} onChange={e => setStartHour(e.target.value)}>{hourOptions.map(h => <option key={h} value={h}>{h}</option>)}</select>
            :
            <select value={startMinute} onChange={e => setStartMinute(e.target.value)}>{minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}</select>
            <select value={startPeriod} onChange={e => setStartPeriod(e.target.value)}>{periodOptions.map(p => <option key={p} value={p}>{p}</option>)}</select>
          </div>
        </label>
        <label htmlFor="endTimeGroup">
          End Time:
          <div id="endTimeGroup" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select value={endHour} onChange={e => setEndHour(e.target.value)}>{hourOptions.map(h => <option key={h} value={h}>{h}</option>)}</select>
            :
            <select value={endMinute} onChange={e => setEndMinute(e.target.value)}>{minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}</select>
            <select value={endPeriod} onChange={e => setEndPeriod(e.target.value)}>{periodOptions.map(p => <option key={p} value={p}>{p}</option>)}</select>
          </div>
        </label>
        {timeError && (
          <div style={{color: 'red', fontSize: '0.95em'}}>End time must be after start time.</div>
        )}
        <label htmlFor="driveTime">
          Drive Time (hours):
          <input id="driveTime" type="number" step="0.1" min="0" value={driveTime} onChange={e => setDriveTime(e.target.value)} required />
        </label>
      </form>
      <div className="results">
        <h2>Results</h2>
        <p><span role="img" aria-label="clock">🕒</span><strong>Total Hours (move + drive):</strong> {totalHours.toFixed(2)}</p>
        <p><span role="img" aria-label="worker">👷‍♂️</span><strong>Move Time:</strong> {moveTime.toFixed(2)} hrs</p>
        <p><span role="img" aria-label="truck">🚚</span><strong>Drive Time:</strong> {Number(driveTime).toFixed(2)} hrs</p>
        <p className="total"><span role="img" aria-label="money">💵</span>Subtotal: ${subtotal.toFixed(2)}</p>
        <p style={{fontSize: '0.98em', color: '#234075', whiteSpace: 'pre-line'}}>{breakdown}</p>
        <div className="divider"></div>
        <p><span role="img" aria-label="tax">🧾</span><strong>With Tax (13% HST):</strong> ${taxedTotal.toFixed(2)}</p>
        <p className="total"><span role="img" aria-label="credit card">💳</span>Total with CC Fee (5%): ${ccTotal.toFixed(2)}</p>
      </div>
      <button onClick={handleExportCSV} className="export-btn" disabled={timeError}>Export as CSV</button>
    </div>
  )
}

export default App
