import {http} from '@/request'
function exportFiles (urls:string, data:object) {
    // @ts-ignore
    window.open(process.env.VUE_APP_context + urls+"?data="+encodeURI(JSON.stringify(data)));
}

// 请求接口
export async function Get(data:object):Promise<any> {
    let res = await http.post('/bbb',data)
    return res
}

// 导出接口
export async function Down(data:object):Promise<any> {
    exportFiles('/aaa',data)
}

