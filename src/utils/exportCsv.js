export const exportTransactionsToCsv = (transactions, currency) => {
  if (transactions.length === 0) return

  const headers = ['Date', 'Title', 'Category', 'Type', `Amount (${currency})`]

  const escapeCell = (value) => {
    const str = String(value ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const rows = transactions.map((t) => [
    t.date,
    t.title,
    t.category,
    t.type,
    t.amount,
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCell).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const today = new Date().toISOString().split('T')[0]

  link.href = url
  link.download = `sable-ledger-transactions-${today}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}