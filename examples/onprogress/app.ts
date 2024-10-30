import axios from '../../src'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

const instance = axios.create()

function calculateProgress(loaded: number, total: number) {
  return Math.floor(loaded * 1.0) / total
}

function loadProgressBar() {
  const setupStartProgress = () => {
    instance.interceptors.request.use((config) => {
      nProgress.start()
      return config
    })
  }
  const setupUpdateProgress = () => {
    const update = (e: ProgressEvent) => {
      nProgress.set(calculateProgress(e.loaded, e.total))
    }
    instance.defaults.onDownloadProgress = update
    instance.defaults.onUploadProgress = update
  }
  const setupStopProgress = () => {
    instance.interceptors.response.use(
      (response) => {
        nProgress.done()
        return response
      },
      (e) => {
        nProgress.done()
        return Promise.reject(e)
      },
    )
  }

  setupStartProgress()
  setupUpdateProgress()
  setupStopProgress()
}

try {
  loadProgressBar()
} catch (e) {
  console.log('loadProgressBar error:', e)
}

const downloadBtn = document.querySelector('#download')

downloadBtn?.addEventListener('click', (e) => {
  instance
    .get('https://img1.sycdn.imooc.com/szimg/65967fa40865fe8805400304.jpg')
    .catch((e) => {
      console.log('error', e)
    })
})

const uploadBtn = document.querySelector('#upload')

uploadBtn?.addEventListener('click', async (e) => {
  const data = new FormData()
  const fileEl = document.querySelector('#file') as HTMLInputElement
  if (fileEl.files) {
    data.append('file', fileEl.files[0])
    try {
      await instance.post('/onprogress/upload', data)
      // 处理成功后的逻辑，比如显示上传成功的消息
      console.log('Upload successful')
    } catch (error) {
      console.error('Upload error:', error)
      // 处理错误的逻辑，比如显示错误消息
    }
  } else {
    console.error('No file selected')
  }
})
