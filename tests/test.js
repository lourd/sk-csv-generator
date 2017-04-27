const path = require('path')
const fs = require('fs')

const { run } = require('../')

const testFiles = ['animals', 'dogs', 'pokemon']

describe('test files', () => {
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
})
