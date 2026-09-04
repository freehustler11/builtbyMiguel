import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackStart(),
    tailwindcss(),
    react(),
    {
      name: 'node-builtins-client-shim',
      enforce: 'pre',
      resolveId(id: string, _importer: unknown, options?: { ssr?: boolean }) {
        if (!options?.ssr) {
          if (id === 'node:stream' || id === 'stream') return '\0virtual:node-stream'
          if (id === 'node:stream/web' || id === 'stream/web') return '\0virtual:node-stream-web'
          if (id === 'node:async_hooks' || id === 'async_hooks') return '\0virtual:node-async-hooks'
        }
      },
      load(id: string) {
        if (id === '\0virtual:node-stream') {
          return `
            export class Readable {
              static fromWeb() { return {} }
              static toWeb() { return {} }
            }
            export class Writable {}
            export class Transform {}
            export class PassThrough {}
            export class Duplex {}
            export class Stream {}
            export const pipeline = () => {}
            export const finished = () => {}
            export const promises = { pipeline: async () => {}, finished: async () => {} }
            export default { Readable, Writable, Transform, PassThrough, Duplex, Stream, pipeline, finished, promises };
          `
        }
        if (id === '\0virtual:node-stream-web') {
          return `
            export const ReadableStream = globalThis.ReadableStream
            export const WritableStream = globalThis.WritableStream
            export const TransformStream = globalThis.TransformStream
            export default { ReadableStream, WritableStream, TransformStream };
          `
        }
        if (id === '\0virtual:node-async-hooks') {
          return `
            export class AsyncLocalStorage {
              getStore() { return undefined }
              run(store, callback) { return callback() }
            }
            export default { AsyncLocalStorage };
          `
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

