const path = require('path')
const fs = require('mz/fs')

const { run } = require('../')

const testFiles = ['animals', 'dogs', 'pokemon']

describe('test files', () => {
  testFiles.forEach(input => {
    const inFile = `${input}.csv`
    const outFile = `${input}-out.csv`
    it(`${inFile} should transform to ${outFile}`, async () => {
      const file = path.resolve(__dirname, inFile)
      const expectedFile = path.resolve(__dirname, outFile)
      const [outBuf, results] = await Promise.all([
        fs.readFile(expectedFile),
        run(file)
      ])
      expect(results).toBe(outBuf.toString())
    })
  })
})
