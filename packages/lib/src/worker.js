
self.onmessage = async ({data: {question}}) => {
  console.log('[worker]', question)
  self.postMessage({
    answer: 42,
  })
}
