import { readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const clientDirectory = join(projectRoot, 'dist')
const serverDirectory = join(projectRoot, '.prerender')
const serverEntry = (await readdir(serverDirectory)).find((file) => /^entry-server\.(m?js)$/.test(file))

if (!serverEntry) {
  throw new Error('The server-rendered entry bundle was not found.')
}

const { render } = await import(pathToFileURL(join(serverDirectory, serverEntry)).href)
const pages = [
  { pathname: '/', file: 'index.html' },
  { pathname: '/hospitals', file: 'hospitals.html' },
  { pathname: '/manufacturing', file: 'manufacturing.html' },
  { pathname: '/solar-cold-storage', file: 'solar-cold-storage.html' },
  { pathname: '/404', file: '404.html' },
]

for (const page of pages) {
  const filePath = join(clientDirectory, page.file)
  const document = await readFile(filePath, 'utf8')
  const markup = render(page.pathname)
  const root = '<div id="root"></div>'

  if (!document.includes(root)) {
    throw new Error(`Could not find the empty React root in ${page.file}.`)
  }

  if (!markup.includes('id="main-content"')) {
    throw new Error(`The rendered page body is incomplete for ${page.pathname}.`)
  }

  await writeFile(filePath, document.replace(root, `<div id="root">${markup}</div>`))
}

await rm(serverDirectory, { recursive: true })
console.log(`Prerendered ${pages.length} HTML documents.`)
