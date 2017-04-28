## Installation

You'll need npm & Node.js v7.6 or greater. I recommend [Homebrew](brew.sh) on OSX.

```sh
brew install node
```

And then

```sh
git clone git@github.com:lourd/sk-csv-generator.git
cd sk-csv-generator
npm install
```

## Usage

```sh
# From the program's directory
node . <file> [<outputFile>]
```

Omitting the output file will output the results to stdout.
