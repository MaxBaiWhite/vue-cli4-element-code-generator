import {http} from '@/request'

function exportFiles(urls: string, data: object) {
    // @ts-ignore
    window.open(process.env.VUE_APP_context + urls + "?data=" + encodeURI(JSON.stringify(data)));
}

export async function SubmitData(data: object): Promise<any> {
    let res = await http.post('/interface/createFeGenerator', data)
    return res
}
export async function ChangeData(data: object): Promise<any> {
    let res = await http.post('/interface/updateFeGenerator', data)
    return res
}
export async function GetDataList(data: object): Promise<any> {
    let res = await http.post('/interface/getFeGeneratorPage', data)
    return res
}
export async function DeleteData(data: object): Promise<any> {
    let res = await http.post('/interface/deleteFeGenerator', data)
    return res
}

export async function DownTeminalInventory(data: object): Promise<any> {
    exportFiles('/flow/query/downTeminalInventory', data)
}