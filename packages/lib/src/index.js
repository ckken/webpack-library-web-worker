
const worker = new Worker(new URL('./worker.js', import.meta.url))

const Lib = () => {
  worker.postMessage({
    question: 'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
  })
  worker.onmessage = ({data: {answer}}) => {
    console.log('[main thead]', answer)
  }
}
export default Lib
