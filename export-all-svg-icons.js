const glob = require('glob')
const path = require('path')
const execSync = require('child_process').execSync
const writtenNumber = require('written-number')

/**
 * convert name start number into word
 *
 * @exampes
 * adsk_124 => adsk_124
 * a4_adsk_124 => a4_adsk_124
 * 1234_adsk_124 => one_thousand_two_hundred_thirty_four_adsk_124
 * 0004_adsk_124 => four_adsk_124
 * 4e2_adsk_124 => four_e2_adsk_124
 */
function startNumberToWord(name, delimiter = '_') {
  let startNumberIndex = 0
  while (
    startNumberIndex < name.length &&
    name[startNumberIndex] >= '0' &&
    name[startNumberIndex] <= '9'
  ) {
    startNumberIndex++
  }
  if (startNumberIndex === 0) return name

  const startNumber = Number(name.substring(0, startNumberIndex))

  const writtenStartNumber =
    writtenNumber(startNumber, { noAnd: true })
      .replace(/[\s-]/g, '_')

  return writtenStartNumber +
   (name.charAt(startNumberIndex) === delimiter ? '' : delimiter) +
   name.substring(startNumberIndex)
}

const savedDir = path.join(__dirname, '__exported_svg')

const type = 'production'

execSync(`mkdir -p ${savedDir}`)

const count = glob.sync(`${__dirname}/*/`)
  .map(typePath => {
    const svgs = glob.sync(`${typePath}/svg/${type}/ic_*_24px.svg`)
    svgs.forEach(p => {
      const fileName = path.basename(p, '.svg')
      const matchRes = fileName.match(/^ic_(.*)_24px$/)
      if (!matchRes) {
        throw new Error(`/^ic_(.*)_24px$/ can't match filename: ${fileName}`)
      }
      const newFileName = startNumberToWord(matchRes[1]).replace(/_/g, '-')
      const cmd = `cp ${p} ${savedDir}/${newFileName}.svg`
      console.log(cmd)
      execSync(cmd)
    })
    return svgs.length
  })
  .reduce((pre, cur) => pre + cur, 0)

console.log(`${count} svgs exported`)
