const path = require('path')
const csv = require('csv')
const fs = require('fs')
const async = require('async')

const { run, parse } = require('../')

const testFiles = ['animals', 'dogs']

testFiles.forEach(input => {
  const inFile = `${input}.csv`
  const outFile = `${input}-out.csv`
  it(`${inFile} should transform to ${outFile}`, () => {
    const file = path.resolve(__dirname, inFile)
    const expectedFile = path.resolve(__dirname, outFile)
    const expected = fs.readFileSync(expectedFile).toString()
    return run(file).then(data => {
      expect(data).toBe(expected)
    })
  })
})
