interface Window {
}

type resCode = {
    errorCode: string
    errorMsg: string
    url: string
}
type fileNameType = string
type  interfaceListType = {
    type?: number
    name?: string
    url?: string
    codeName?: string
    codeFlage?: boolean
    isShowSwitch?:boolean
    isDynamicTable?:string
}[]

type codeListType = {
    label?: string
    value?: string
}[]
type   searcherParamListType = {
    type?: number
    code?: string
    name?: string
    value?: string
    codeFlage?: boolean
}[]
type   tableParamListType = {
    type?: number
    name?: string
    position?: string
    value?: string
    code?: string
    codeFlage?: boolean
    sortable?:string
}[]
type    detailParamListType = {
    type?: number
    name?: string
    count?: number
    value?: string
    code?: string
    codeFlage?: boolean
    isNeed?: string
}[]
type   tableCheckListType = string[]
type   selectCodeListType = {
    label?:string
    value?:string
}[]

interface generatorDataType {
    tableCheckList?:tableCheckListType
    detailParamList?:detailParamListType
    tableParamList?:tableParamListType
    searcherParamList?:searcherParamListType
    codeList?:codeListType
    interfaceList?:interfaceListType
    fileName?:fileNameType
    selectCodeList?:selectCodeListType
}

type strobjType = {
    importService?:string
    service?:string
    serviceMethodsStr?:string
    serviceButtonStr?:string
    importDataStr?:string
    serviceVarStr?:string
    initExecFunction?:string
    dynamicTableColumn?:string
    dynamicFilter?:string
}