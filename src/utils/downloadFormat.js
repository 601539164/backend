
const downloadFormat = (res) => {
  console.log(res)
  // return
  const blob = res.res
  const link = document.createElement('a')
  link.href = URL.createObjectURL(
    new Blob([blob], { type: 'application/vnd.ms-excel' })
  )
  link.download = res.documentName
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(link.href)
}

export { downloadFormat }
