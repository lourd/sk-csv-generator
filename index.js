const fs = require('mz/fs')
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

function stringify(arrayOrObj, opts) {
  return new Promise((resolve, reject) => {
    csv.stringify(arrayOrObj, opts, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

/**
 * Our utils
 */

function transform(array) {
  const rows = []
  const ignoredProps = [
    'inherits',
    'prefix',
    'is a',
  ]
  for (const item of array) {
    const row1 = []
    let id = item['official name'].toLowerCase().replace(' ', '')
    if (item.prefix) {
      id = `${item.prefix}_${id}`
    }
    row1.push(id)
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
  return rows
}

/**
 * WARNING: Mutative!
 * @param  {Object[]} array
 * @return {Object[]}
 */
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
  return array
}

function run(fname) {
  return fs.readFile(fname)
    .then(parse)
    .then(applyDefaults)
    .then(transform)
    .then(stringify)
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
      if (!output) {
        console.log(str)
        console.log('Ya know, if you want the output written to a file you can another filename after the input filename 🖖🏽')
      }
      else {
        const outfile = path.resolve(__dirname, output)
        fs.writeFileSync(output, str)
      }
    })
    .catch(() => {
      console.log('Uh oh, that didn\'t work. 😞  Maybe that\'s not a real file or something?')
    })
}

if (require.main === module) {
  cli()
}

module.exports = {
  run,
  parse,
  applyDefaults,
  cli,
}
