const express = require('express');
const { requestABrowser } = require('../services/browser');
const router = express.Router();
const dayjs = require('dayjs')
dayjs.extend(require('dayjs/plugin/duration'))

router.get('/', async (req, res, next) => {
  const { browser, token, page } = await requestABrowser()
  const times = await getTimes(page)
  await page.close()
  await browser.close()
  res.json({
    token,
    value: times
  })
})
router.get('/remaining', async (req, res, next) => {
  const { browser, token, page } = await requestABrowser()
  const times = await getRemainingTime(await getTimes(page))
  await page.close()
  await browser.close()
  res.json({
    token,
    value: times
  })
})
router.post('/', async (req, res) => {
  const { browser, token, page } = await requestABrowser()
  await page.goto(`https://welcoop.bodet-software.com/open/homepage?ACTION=intranet&asked=1&header=0`)
  const btn = await page.waitForSelector('a.boutonAction.defaultActionBouton')
  btn.click()
  const response = await page.waitForSelector('ul.badgeuseVirtuelle')
  const text = (await response.evaluate(el => el.textContent)).trim()
  await page.close()
  await browser.close()
  res.json({token, text})
})



module.exports = router;


const goalByDaysInMinutes = (60 * 7 + 24)
function getRemainingTime(times) {
  const daysFromStartOfWeek = dayjs().diff(dayjs().startOf('week'), 'days')

  let workTime = 0
  Object.keys(times).map(day => {
    const timesOfDay = times[day]
    let workTimeOnDay = 0
    chunk(timesOfDay, 2).forEach(([begin, end]) => {
      if ((!begin || !end) && !isToday(day)) return
      if (isToday(day) && !end) end = dayjs().toISOString()
      const work = dayjs(end).diff(begin, 'minutes', true)
      workTime += work
      workTimeOnDay += work
    })
    times[day] = {
      workTime: workTimeOnDay,
      balanceTime: workTimeOnDay - goalByDaysInMinutes,
    }
  })
  return {
    workTime,
    balanceTime: workTime - goalByDaysInMinutes * daysFromStartOfWeek,
    byDays: times
  }
}
function isToday(day) {
  return dayjs(day).startOf('day').isSame(dayjs().startOf('day'))
}
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

async function getTimes(page) {
  await page.goto('https://welcoop.bodet-software.com/open/homepage?ACTION=intranet&asked=3&header=0')
  await page.waitForFunction(() => 'typeof fcDoAction === "function"')
  await page.waitForTimeout(100)
  await page.evaluate(() => {
    // @ts-ignore
    fcDoAction('AFFICHER_BADGEAGES_SEMAINE');
  })
  await page.waitForFunction(() => 'typeof fcAfficherDetailCumuls === "function"')
  await page.waitForTimeout(100)
  await page.evaluate(() => {
    // @ts-ignore
    fcAfficherDetailCumuls()
  })
  await page.waitForSelector('tr[align=center]')
  const dates = await page.evaluate(() => {
    return [...document.querySelectorAll('tr[align=center]')].slice(1).map($line => {
      return {
        date: $line.querySelectorAll('td')[0].innerText,
        times: [...$line.querySelectorAll('td table td table td table td[align=center]')].map(a => a.innerText.trim())
      }
    }).filter(a => a?.times?.length)
  })
  return parseTimes(dates)
}

function parseTimes(week) {
  const allTimes = {}
  week.map(day => {
    const dayISOString = dayjs(day.date.split('/').reverse().join('-')).add(4, 'hours').toISOString()
    allTimes[dayISOString.substring(0, 10)] = day.times.map(time => {
      const [hour, minute] = time.split(':')
      const date = new Date(dayISOString)
      date.setHours(+hour, +minute)
      return date.toISOString()
    })
  })
  return allTimes
}