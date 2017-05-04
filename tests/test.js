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

  it('should throw an error if a property does not have a "has official name" property', async () => {
    const file = path.resolve(__dirname, './no-name.csv')
    expect.assertions(1)
    try {
      await run(file)
    } catch (e) {
      expect(e).toMatchSnapshot()
    }
  })
})
