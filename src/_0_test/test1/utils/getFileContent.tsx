import axios from "axios"
export async function getFilePubInfoByFileId(id) {
  const data = {
    "fileId": id,
    "envType": "prod"
  }
  const res = await axios.post('https://fangzhou.corp.kuaishou.com/api/paas/file/getFilePubInfoByFileId',data)
  console.log('getFilePubInfoByFileId的res',res)
  return res.data
}

export async function getFileContent(id) {
  const data = {
    "id": id
  }
  const res = await axios.post('https://fangzhou.corp.kuaishou.com/api/paas/file/getFileContent',data)
  return res.data
}