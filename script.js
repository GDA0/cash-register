const price = 6.65 // Equivalent to Ghc100 on 06/17/2024
const cid = [
  ['CENT', 1.1],
  ['NICKEL', 5],
  ['DIME', 9],
  ['QUARTER', 20],
  ['ONE', 70],
  ['TWO', 120],
  ['FIVE', 250],
  ['TEN', 400],
  ['TWENTY', 600],
  ['FIFTY', 1000],
  ['ONE HUNDRED', 1000]
]

const purchaseForm = document.querySelector('form')
const cashInput = purchaseForm.querySelector('#cash')

const priceDisplay = document.querySelector('.price')
const changeDueDisplay = document.querySelector('#change-due')
const cashInDrawerDisplay = document.querySelector('.cash-in-drawer')

purchaseForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const cash = Number(cashInput.value)
  if (!cash) {
    alert("Please enter customer's cash")
  } else {
    checkCashRegister(cash)
  }
})

function displayResults (status, change) {
  changeDueDisplay.innerHTML = `<h4>Status: ${status}</h4>`
  change.forEach(
    (money) =>
      (changeDueDisplay.innerHTML += `<li class='fs-6'><strong>${money[0]}:</strong> $${money[1]}</li>`)
  )
}

function checkCashRegister (cash) {
  if (cash < price) {
    alert('Customer does not have enough money to purchase the item')
    cashInput.value = ''
    return
  }

  if (cash === price) {
    changeDueDisplay.innerHTML =
			'<h3>No change due - customer paid with exact cash</h3>'
    cashInput.value = ''
    return
  }

  let changeDue = cash - price
  const reversedCid = [...cid].reverse()
  const denominations = [100, 50, 20, 10, 5, 2, 1, 0.25, 0.1, 0.05, 0.01]
  const result = { status: 'OPEN', change: [] }
  const totalCID = parseFloat(
    cid.reduce((total, denom) => total + parseFloat(denom[1]), 0).toFixed(2)
  )

  if (totalCID < changeDue) {
    return (changeDueDisplay.innerHTML =
			'<h4>Status: INSUFFICIENT_FUNDS</h4>')
  }

  if (totalCID === changeDue) {
    displayResults('CLOSED', cid)
    return
  }

  for (let i = 0; i < reversedCid.length; i++) {
    const denomValue = denominations[i]
    let denomTotal = reversedCid[i][1]
    if (changeDue >= denomValue && denomTotal > 0) {
      let count = 0
      while (denomTotal > 0 && changeDue >= denomValue) {
        denomTotal -= denomValue
        changeDue -= denomValue
        changeDue = parseFloat(changeDue.toFixed(2))
        count++
      }
      result.change.push([reversedCid[i][0], count * denomValue])
    }
  }

  if (changeDue > 0) {
    changeDueDisplay.innerHTML = '<h4>Status: INSUFFICIENT_FUNDS</h4>'
    return
  }

  displayResults(result.status, result.change)
  updateUI(result.change)
}

function updateUI (change) {
  const currencyNameMap = {
    CENT: 'Cents',
    NICKEL: 'Nickels',
    DIME: 'Dimes',
    QUARTER: 'Quarters',
    ONE: 'Ones',
    TWO: 'Twos',
    FIVE: 'Fives',
    TEN: 'Tens',
    TWENTY: 'Twenties',
    FIFTY: 'Fifties',
    'ONE HUNDRED': 'Hundreds'
  }
  if (change) {
    change.forEach(([denom, amount]) => {
      const targetArr = cid.find(([name]) => name === denom)
      targetArr[1] -= amount
      targetArr[1] = parseFloat(targetArr[1].toFixed(2))
    })
  }

  cashInput.value = ''
  priceDisplay.textContent = `Total cost: $${price}`
  cashInDrawerDisplay.innerHTML = `
		${cid
			.map(
				([denom, amount]) =>
					`<li><strong>${currencyNameMap[denom]}:</strong> $${amount}</li>`
			)
			.join('')}
	`
}

updateUI()
