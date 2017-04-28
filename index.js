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
}

async function run(fname) {
  const buf = await fs.readFile(fname)
  const items = await parse(buf)
  applyDefaults(items)
  const rows = transform(items)
  return await stringify(rows)
}

/**
 * When run from the command line
 */

async function cli() {
  const [input, output] = process.argv.slice(2)
  if (!input) {
    console.log('What file? Ya gotta gimme something to work with!')
    process.exit(1)
  }
  try {
    const string = await run(path.resolve(__dirname, input))
    if (!output) {
      console.log(string)
      console.log('Ya know, if you want the output written to a file you can another filename after the input filename 🖖🏽')
    }
    else {
      await fs.writeFile(path.resolve(__dirname, output), string)
    }
  } catch (err) {
    console.log('Uh oh, that didn\'t work. 😞  Maybe that\'s not a real file or something?')
  }
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
