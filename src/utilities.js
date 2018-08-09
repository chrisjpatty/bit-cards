import JsonUrl from 'json-url'
import 'json-url/dist/browser/json-url-msgpack'
import 'json-url/dist/browser/json-url-lzma'
import 'json-url/dist/browser/json-url-safe64'
import PCancelable from './libraries/p-cancelable'
// import 'json-url/dist/browser/json-url-lzw'
// import 'json-url/dist/browser/json-url-lzstring'
const { compress, decompress } = JsonUrl('lzma')

export const encode = value => new PCancelable((resolve, reject, onCancel) => {
  const worker = compress(value)
  worker.then(resolve)
  .catch(reject)
})

export const decode = value => new PCancelable((resolve, reject, onCancel) => {
  const worker = decompress(value)
  worker.then(resolve).catch(reject)
})

export const getFontSize = string => {
  if(string.length > 300){
    return '2.5vh'
  }
  if(string.length > 150){
    return '3vh'
  }
  if(string.length > 30){
    return '4vh'
  }
  if(string.length <= 3){
    return '10vh'
  }
  return ''
}
