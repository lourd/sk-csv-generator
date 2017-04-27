const path = require('path')
const csv = require('csv')
const fs = require('fs')
const async = require('async')

const { run, parse } = require('../')

const testFiles = [
  ['test.csv', 'expected.csv'],
]

testFiles.forEach(([input, output]) => {
  it(`${input} should transform to ${output}`, () => {
    const file = path.resolve(__dirname, input)
    const expectedFile = path.resolve(__dirname, output)
    const expected = fs.readFileSync(expectedFile).toString()
    return run(file).then(data => {
      expect(data).toBe(expected)
    })
  })
})
