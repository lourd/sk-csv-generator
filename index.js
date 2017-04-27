const fs = require('fs')
const path = require('path')
const csv = require('csv')

/**
 * CSV Utils
 */

function parse(buff, opts) {
  const options = Object.assign({
    columns: true,
    trim: true,
  }, opts)
  return new Promise((resolve, reject) => {
    csv.parse(buff, options, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function stringify(arg, opts) {
  return new Promise((resolve, reject) => {
    csv.stringify(arg, opts, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

/**
 * Our utils
 */

function run(fname) {
  const f = fs.readFileSync(fname)
  return parse(f).then(data => {
    applyDefaults(data)
    return transform(data)
  })
}

const ignoredProps = [
  'inherits',
  'prefix',
  'is a',
]

function transform(array) {
  const rows = []
  for (const item of array) {
    const row1 = []
    const name = item.prefix
      ? `${item.prefix}_${item['official name']}`
      : item['official name']
    row1.push(name)
    row1.push('is a')
    const type = item.inherits
      ? `${item.inherits}_${item['is a']}`
      : item['is a']
    row1.push(type)
    rows.push(row1)

    const propRows = Object.keys(item)
      .filter(prop => !ignoredProps.includes(prop))
      .map(prop => {
        const row = []
        row.push('') // indent one column
        row.push(`has ${prop}`)
        row.push(item[prop])
        return row
      })
    rows.push(...propRows)
  }
  return stringify(rows)
}

function applyDefaults(array) {
  const defaults = {}
  for (const item of array) {
    for (const prop in item) {
      if (item[prop]) {
        defaults[prop] = item[prop]
      } else {
        item[prop] = defaults[prop]
      }
    }
  }
}

/**
 * When run from the command line
 */

function cli() {
  const [input, output] = process.argv.slice(2)
  if (!input) {
    console.log('What file? Ya gotta gimme something to work with!')
    process.exit(1)
  }
  const inFile = path.resolve(__dirname, input)
  run(inFile)
    .then(str => {
      if (!output) console.log(str)
      else {
        const outfile = path.resolve(__dirname, output)
        fs.writeFileSync(output, str)
      }
    })
}

if (require.main === module) {
  cli()
}

module.exports = {
  run,
  parse,
  applyDefaults,
}
