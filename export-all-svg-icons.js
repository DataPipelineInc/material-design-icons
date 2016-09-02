const glob = require('glob')
const path = require('path')
const execSync = require('child_process').execSync

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
      const newFileName = matchRes[1].replace(/_/g, '-')
      const cmd = `cp ${p} ${savedDir}/${newFileName}.svg`
      console.log(cmd)
      execSync(cmd)
    })
    return svgs.length
  })
  .reduce((pre, cur) => pre + cur, 0)

console.log(`${count} svgs exported`)
