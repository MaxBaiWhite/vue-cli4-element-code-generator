let isDialog = false
let dynamicTableColumn = ``
//  生成过滤器
function generateFilter({searcherParamList}:generatorDataType): {
  filterStr?:string
  filterMethodStr?:string
  filterVarStr?:string
}
{
  let filter:{
    filterStr?:string
    filterMethodStr?:string
    filterVarStr?:string
  } = {}
  let str = ``
  let filterMethodStr = ``
  let filterVarStr = ``
  for (let item of searcherParamList!) {
    // 0: 'Select'
    // 1: 'Input'
    // 2: 'TimeSelect'
    // 3: 'DatePicker'
    switch (item.type) {
      case 0: {
        str += `
                <FormItem class="filter-item" label="${item.name}:" style="margin-right: 26px">
                  <Select
                    v-model="form.${item.value}"
                    :clearable="true"
                    placeholder="请选择${item.name}"
                    size="small"
                  >
                    <Option
                      v-for="item in ${item.code}"
                      :label="item.label"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>`
        break;
      }
      case 1: {
        str += `
               <FormItem class="filter-item" label="${item.name}" style="margin-right: 26px">
                  <Input
                    v-model="form.${item.value}"
                    size="small"
                    placeholder="请输入${item.name}"
                  />
               </FormItem>`
        break;
      }
      case 2: {
        str += `
                <FormItem class="filter-item" label="${item.name}" style="margin-right: 26px">
                  <TimeSelect
                    :picker-options="{
                        start: '08:30',
                        step: '00:15',
                        end: '18:30'
                      }"
                    v-model="form.${item.value}"
                    placeholder="请选择时间"
                    size="small"
                  />
                </FormItem>`
        break;
      }
      case 3: {
        str += `
                <FormItem class="filter-item" label="${item.name}" style="margin-right: 26px">
                  <DatePicker
                    v-model="form.${item.value}"
                    type="date"
                    placeholder="请选择日期"
                    size="small"
                  />
                </FormItem>`
        break;
      }
      case 4: {
        str += `
                <FormItem class="filter-item" label="${item.name}" style="margin-right: 26px">
                  <DatePicker
                    v-model="form.${item.value}"
                    :clearable="true"
                    placeholder="请选择日期范围"
                    size="small"
                    type="daterange"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    @change="${item.value}Change"
                  />
                </FormItem>`
        filterMethodStr += `
                          ${item.value}Change(s:string[]) {
                              this.form.${item.value}Start = s[0]
                              this.form.${item.value}End = s[1]
                          }
                          `
        filterVarStr = `
                       pickerOptions = {
                          shortcuts: [{
                              text: '最近一周',
                              onClick(picker:any) {
                                  const end = new Date();
                                  const start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                  picker.$emit('pick', [start, end]);
                              }
                          }, {
                              text: '最近一个月',
                              onClick(picker:any) {
                                  const end = new Date();
                                  const start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                  picker.$emit('pick', [start, end]);
                              }
                          }, {
                              text: '最近三个月',
                              onClick(picker:any) {
                                  const end = new Date();
                                  const start = new Date();
                                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                  picker.$emit('pick', [start, end]);
                              }
                          }]
                      }
                      `
        break;
      }

    }
  }
  filter.filterStr =  str
  filter.filterMethodStr = filterMethodStr
  filter.filterVarStr = filterVarStr
  return filter
}

//  生成列表
function generateTableList({ tableParamList, tableCheckList}:generatorDataType) {
  // 0: 'Select'
  // 1: 'Input'
  // 2: 'TimeSelect'
  // 3: 'DatePicker'
  // [{label:'名称',value:'值'}]
  let str = ``
  for (let item of tableParamList!) {
    switch (item.type) {
      case 0: {
        str += `
                <TableColumn label="${item.name}"  class="export-th"  data-prop="${item.value}-${item.name}" :show-overflow-tooltip="true" ${item.position!=='no'?'fixed='+item.position:''} ${item.sortable?'sortable="custom"':''}>
                  <template slot-scope="scope">
                        <span :style="typeof scope.row.${item.value} != 'undefined' && ${item.code}.length > 0&&${item.code}[0].color?'color:'+${item.code}.filter((item) => item.value == scope.row.${item.value} )[0].color:''">{{typeof scope.row.${item.value} != 'undefined'?${item.code}.filter((item) => item.value == scope.row.${item.value} )[0].label:'' }}</span>
                  </template>
                </TableColumn>`
        break;
      }
      default: {
        if (item.type) {
          str += `
                 <TableColumn :show-overflow-tooltip="true"  class="export-th" data-prop="${item.value}-${item.name}" prop="${item.value}" ${item.position!=='no'?'fixed='+item.position:''} ${item.sortable?'sortable="custom"':''} label="${item.name}" />`
          break;
        }
      }
    }
  }
  str+=dynamicTableColumn
  if (tableCheckList!.length > 0) {
    str += `
<TableColumn prop="data" label="操作" width='120' align="center" fixed="right">
                        <template slot-scope="scope">`
    for (let item of tableCheckList!) {
      if (item === '查看') {
        str += `
<Button  type="text" @click="showDetailDialog(scope)" size="small">查看</Button>`
      } else if (item === '编辑') {
        str += `
<Button  type="text" @click="showChangeDialog(scope)" size="small">编辑</Button>`
      }
    }
    str += `
</template></TableColumn>`
  }
  return str
}

//  生成详情
function generateDialog({detailParamList}:generatorDataType) {
  let str = ``
  for (let item of detailParamList!) {
    // 0: 'Select'
    // 1: 'Input'
    // 2: 'TimeSelect'
    // 3: 'DatePicker'
    switch (item.type) {
      case 0: {
        str += `
                <Col  :span="${item.count?24/item.count: 8}">
                  <FormItem class="filter-item" label="${item.name}:" ${item.isNeed==='yes'?'prop="'+item.value+'" :rules="{ required: true, message:\''+item.name+'不能为空\', trigger: \'blur\'}"':''}>
                    <Select
                      v-model="dialogInfo.${item.value}"
                      :clearable="true"
                      placeholder="请选择${item.name}"
                      style="width: 100%;"
                      size="small"
                    >
                      <Option
                        v-for="item in ${item.code}"
                        :label="item.label"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </Option>
                    </Select>
                   </FormItem>
                </Col>`
        break;
      }
      case 1: {
        str += `
                <Col  :span="${item.count?24/item.count: 8}">
                  <FormItem class="filter-item" label="${item.name}:" ${item.isNeed==='yes'?'prop="'+item.value+'" :rules="{ required: true, message: \''+item.name+'不能为空\', trigger: \'blur\'}"':''}>
                  <Input
                    v-model="dialogInfo.${item.value}"
                    size="small"
                    style="width: 100%;"
                    placeholder="请输入${item.name}"
                  />
                  </FormItem>
                </Col>`
        break;
      }
      case 2: {
        str += `
                <Col  :span="${item.count?24/item.count: 8}">
                  <FormItem class="filter-item" label="${item.name}:" ${item.isNeed==='yes'?'prop="'+item.value+'" :rules="{ required: true, message: \''+item.name+'不能为空\', trigger: \'blur\'}"':''}>
                  <TimeSelect
                    :picker-options="{
                        start: '08:30',
                        step: '00:15',
                        end: '18:30'
                      }"
                    v-model="dialogInfo.${item.value}"
                    style="width: 100%;"
                    placeholder="请选择时间"
                    size="small"
                  />
                  </FormItem>
                  </Col>`
        break;
      }
      case 3: {
        str += `
                <Col  :span="${item.count?24/item.count: 8}">
                  <FormItem class="filter-item" label="${item.name}:" ${item.isNeed==='yes'?'prop="'+item.value+'" :rules="{ required: true, message: \''+item.name+'不能为空\', trigger: \'blur\'}"':''}>
                  <DatePicker
                    v-model="dialogInfo.${item.value}"
                    type="date"
                    placeholder="请选择日期"
                    style="width: 100%;"
                    size="small"
                  />
                  </FormItem>
                </Col>`
        break;
      }

    }
  }
  return `
<!-- 详情 -->
        <Dialog :visible.sync="detailDialogVisible" width="950px">
            <!--            头部-->
            <p slot="title" v-if='dialogType == 1' style="font-size:18px;border-bottom:1px solid #ddd;padding-bottom:10px">
                新增数据
            </p>
            <p slot="title" v-if='dialogType == 2' style="font-size:18px;border-bottom:1px solid #ddd;padding-bottom:10px">
                编辑信息
            </p>
            <p slot="title" v-if='dialogType == 3' style="font-size:18px;border-bottom:1px solid #ddd;padding-bottom:10px">
                查看信息
            </p>
            <!--                内容-->
            <div  class="dialog-content" style="padding:0 50px">
                <Form label-position="top" :disabled="dialogType==3" ref="dialogForm" :model="dialogInfo">
            <Row :gutter="48">
                ${str}
            </Row>
          </Form>
            </div>
            <!--            尾部-->
            <div slot="footer" class="dialog-footer">
                <Button @click="closeDialog" size='small'>取 消</Button>
                <Button @click="addList" v-if="dialogType == 1 " size='small' type="primary">保 存</Button>
                <Button @click="changeList" v-if="dialogType == 2 " size='small' type="primary">保 存</Button>
            </div>
        </Dialog>
          `
}

// 生成service 文件 方法 TableBotton
function generateService({interfaceList}:generatorDataType) {
  // 0: '列表数据'
  // 1: '列表增'
  // 2: '列表删'
  // 3: '列表改'
  // 4: '列表导入'
  // 5: '列表导出'
  // 6: '字典表接口'
  // 7: '查'
  let strobj:strobjType = {}
  let str = `` //引入service
  let importDataStr = `` //导入
  let codeStr = `` //字典表
  let serviceStr = `` //service 文件
  let serviceMethodsStr = `` // service方法
  let serviceButtonStr = `` // serviceTableBotton
  let serviceVarStr = `` // service变量
  let initExecFunction = `` // 初始化执行方法
  let dynamicFilter = `` // 动态过滤器
  for (let item of interfaceList!) {
    // 导出
    if (item.type === 5) {
      serviceStr += `
                      export async function ${item.name}(data:object):Promise<any> {
                         exportFiles('${item.url}',data)
                      }`
      str += item.name + ','
    } else if (item.type === 4){
      serviceStr += `
                      export async function GetUploadTableList(data:object):Promise<any> {
                        let res = await http.post('/wjcl/dataimportlog/getPage',data)
                        return res
                      }`
      str += 'GetUploadTableList,'
    }else {
      serviceStr += `
                      export async function ${item.name}(data:object):Promise<any> {
                        let res = await http.post('${item.url}',data)
                        return res
                      }`
      str += item.name + ','
    }
    switch (item.type) {
      // 查
      case 0: {
        serviceMethodsStr +=  `
                            async getList() {
                              this.$set(this.loadings, 0, true)
                              let p = Object.assign({}, this.form);
                              let res = await ${item.name}(p);
                              this.tableList = res.list;
                              this.tableCount = res.count;
                              this.$set(this.loadings, 0, false)
                            }`
        if (item.isDynamicTable === 'yes') {
          serviceMethodsStr += `
                              async getTableColumn() {
                                let res = await GetDynamicData({listCode:'${item.url}'})
                                this.customTableColumnList = res.customCellList
                                this.customFilterList = res.customSelectList
                              }
                              `
          serviceStr += `
                      export async function GetDynamicData(data:object):Promise<any> {
                        let res = await http.post('/xtgl/listcustomselect/getCustomList',data)
                        return res
                      }`
          str += 'GetDynamicData,'
          serviceVarStr +=`        
                        // customTableColumnList列表
                        customTableColumnList = []
                        customFilterList = []
                        `
          initExecFunction +=`await this.getTableColumn()`

          dynamicTableColumn += `<TableColumn v-for="tableColumnItem in customTableColumnList" class="export-th"  :key="tableColumnItem.name" :data-prop="tableColumnItem.name+tableColumnItem.label" :show-overflow-tooltip="true" :prop="tableColumnItem.name"  :sortable="tableColumnItem.isSort==1?'custom':''" :width="tableColumnItem.width?tableColumnItem.width:''"  :min-width="tableColumnItem.minWidth?tableColumnItem.minWidth:''"  :label="tableColumnItem.label" />`
          dynamicFilter += `
               <FormItem v-for="customFilter in customFilterList" class="filter-item" :key="customFilter.name" :label="customFilter.label" style="margin-right: 26px">
                  <Input
                    v-model="form[customFilter.name]"
                    size="small"
                    :placeholder="'请输入'+customFilter.label"
                  />
               </FormItem>`
        }
        break;
      }
      // 增
      case 1: {
        isDialog = true
        serviceButtonStr += `
                            <Button type="success" icon="el-icon-plus" size="small" @click="showChangeDialog"  style="margin-left:10px">新建</Button>`
        serviceMethodsStr += `
                            async addList() {
                              // @ts-ignore
                              this.$refs['dialogForm'].validate(async (valid:boolean) => {
                                  if (valid) {
                                    await this.$MessageBox.confirm('此操作将新增信息, 是否继续?', '提示', {
                                      confirmButtonText: '确定',
                                      cancelButtonText: '取消',
                                      type: 'warning',
                                    });
                                    let res = await ${item.name}(this.dialogInfo)
                                    setRes(res, () => {
                                      // 操作成功的回调
                                      this.$Message.success('保存成功!');
                                      this.getList();
                                      this.detailDialogVisible = false
                                    })
                                  } else {
                                      this.$Message.error('操作失败!');
                                  }
                              });
                            }
                            `
        break;
      }
      // 删
      case 2: {
        serviceButtonStr += `
                            <Button type="danger" icon="el-icon-delete" size="small" @click="deleteList"  style="margin-left:10px">删除</Button>`
        serviceMethodsStr += `
                            async deleteList() {
                              if (this.selectList.length === 0) {
                                this.$Message.error('请选择删除内容!');
                                return false
                              }
                              await this.$MessageBox.confirm('此操作将删除选择内容, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                              });
                              let res = await ${item.name}(this.selectList)
                              setRes(res, () => {
                                // 操作成功的回调
                                this.getList();
                                this.$Message.success('删除成功!');
                              })
                            }`
        break;
      }
      // 改
      case 3: {
        isDialog = true
        serviceMethodsStr += `
                              async changeList() {
                                 // @ts-ignore
                                this.$refs['dialogForm'].validate(async (valid:boolean) => {
                                    if (valid) {
                                      await this.$MessageBox.confirm('此操作将修改信息, 是否继续?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                      });
                                      let res = await ${item.name}(this.dialogInfo)
                                      setRes(res, () => {
                                        // 操作成功的回调
                                        this.$Message.success('修改成功!');
                                        this.getList();
                                        this.detailDialogVisible = false
                                      })
                                    } else {
                                      this.$Message.error('操作失败!');
                                    }
                                });
                              }
                              // 显示修改详情
                              async showChangeDialog(e:rowType) {
                                  this.dialogInfo = {}
                                  if (e.type !== 'click') {
                                      // 更改
                                      await this.getDetail(e.row)
                                      this.dialogType = 2
                                  } else {
                                    // 新建
                                    this.dialogType = 1
                                  }
                                  this.detailDialogVisible = true;
                              }
                              `
        break;
      }
      // 导入
      case 4: {
        serviceButtonStr += `<Button icon="el-icon-upload2" type="primary" size="small" @click="showImportDialog"  style="margin-left:10px">导入</Button>`
        importDataStr += `
                        <Dialog :visible.sync="importDialogVisible" width="1000px">
                          <p
                                  slot="title"
                                  style="font-size:18px;border-bottom:1px solid #ddd;padding-bottom:10px"
                          >
                              导入
                          </p>
                          <!-- 导入 -->
                          <div class="dialog-content">
                              <div class="dialog-line">
                                  <span><Icon class="el-icon-edit"/>填写模板:</span>
                                  <a
                                          download="自行搜索修改名称及下载地址.xlsx"
                                          :href="context + '/aaa/bbb.xlsx'"
                                  >自行搜索修改名称及下载地址.xlsx</a
                                  >
                              </div>
                              <div class="dialog-line" style="text-align: right">
                                  <Button size="small" @click="refreshData">刷新数据</Button>
                                  <Uploader
                                          @onSuccess="uploadSuccess"
                                          url="${item.url}"
                                          :parame="{businessKey:'${item.url}'}"
                                          style="display:inline-block;margin-left:10px"
                                  >选择文件
                                  </Uploader
                                  >
                              </div>
                              <div class="uploadTable">
                                  <Table tooltip-effect="dark"
                                         ref="multipleTable"
                                         size="mini"
                                         v-loading="loadings[1]"
                                         element-loading-text="拼命加载中"
                                         element-loading-spinner="el-icon-loading"
                                         element-loading-background="rgba(255, 255, 255, 0.7)"
                                         @selection-change="handleSelectionChange"
                                          max-height="313"
                                         :border='true'
                                         :data="uploadTableList">
                                      <TableColumn prop="importId" :show-overflow-tooltip="true" label="序号">
                                        <template slot-scope="scope">
                                            <span>{{scope.$index+1}}</span>
                                        </template>        
                                      </TableColumn>
                                      <TableColumn prop="importFileName" :show-overflow-tooltip="true" label="文件名"/>
                                      <TableColumn prop="importStatus" :show-overflow-tooltip="true" label="状态">
                                          <template slot-scope="scope">
                                              <span :style="importStatusList[0].color?'color:'+importStatusList.filter((item) => item.value == scope.row.importStatus )[0].color:''">{{ importStatusList.filter((item) => item.value == scope.row.importStatus )[0].label }}</span>       
                                          </template>                                      
                                      </TableColumn>
                                      <TableColumn prop="totalCnt" :show-overflow-tooltip="true" label="总行数">
                                          <template slot-scope="scope">
                                              <span>{{scope.row.totalCnt != null ? scope.row.totalCnt : '暂无'}}</span>          
                                          </template>                                      
                                      </TableColumn>
                                      <TableColumn prop="sucessCnt" :show-overflow-tooltip="true" label="成功数">
                                          <template slot-scope="scope">
                                              <span>{{scope.row.sucessCnt != null ? scope.row.sucessCnt : '暂无'}}</span>          
                                          </template>                                      
                                      </TableColumn>
                                      <TableColumn prop="failCnt" :show-overflow-tooltip="true" label="失败数">
                                          <template slot-scope="scope">
                                              <span>{{scope.row.failCnt != null ? scope.row.failCnt : '暂无'}}</span>          
                                          </template>                                      
                                      </TableColumn>
                                      <TableColumn prop="importStartDt" :show-overflow-tooltip="true" label="上传时间"/>
                                      <TableColumn prop="importFileUrl" :show-overflow-tooltip="true" label="源文件下载">
                                          <template slot-scope="scope">
                                              <a v-if="scope.row.importFileUrl" :download="scope.row.importFileName" style="text-decoration: underline" :href="context+scope.row.importFileUrl">{{'源文件'+scope.row.importFileName}}</a>          
                                              <span v-if="!scope.row.importFileUrl" >暂无</span>        
                                          </template>
                                      </TableColumn>
                                      <TableColumn prop="failFileUrl" :show-overflow-tooltip="true" label="校验文件下载">
                                          <template slot-scope="scope">
                                              <a v-if="scope.row.failFileUrl" :download="scope.row.importFileName" style="text-decoration: underline" :href="context+scope.row.failFileUrl">{{'校验文件'+scope.row.importFileName}}</a>
                                              <span v-if="!scope.row.failFileUrl" >暂无</span>              
                                          </template>                                      
                                      </TableColumn>
                                  </Table>
                              </div>
                              <Row justify="center" type="flex">
                                  <Pagination
                                          style="margin-top:10px"
                                          @current-change="uploadPageChange"
                                          @size-change="uploadPSizeChange"
                                          :page-size="15"
                                          :total="uploadTableCount"
                                          :background="true"
                                          :small="true"
                                          :page-sizes="[15, 30, 50, 100]"
                                          layout="total, sizes, prev, pager, next, jumper"
                                          :current-page="uploadTableFrom.page"
                                  ></Pagination>
                              </Row>
                          </div>
                          <span slot="footer" class="dialog-footer">
                                          <Button @click="importDialogVisible = false" size="small">关闭</Button>
                                        </span>
                      </Dialog>
                          `
        serviceVarStr +=`        
                        uploadTableList = []
                        uploadTableCount = 0
                        importStatusList: codeType[] = [{label: '进行中', value: '0',color:'#E6A23C'}, {label: '上传成功', value: '1',color:'#67C23A'}, {label: '上传失败', value: '3',color:'#F56C6C'}];
                        uploadTableFrom = {page: 1, rows: 15, businessKey: '${item.url}'}
                        importDialogVisible: boolean = false;
                        `
        serviceMethodsStr += `
                           //导入
                            showImportDialog () {
                              this.uploadTableFrom = { page: 1, rows: 15, businessKey: '${item.url}'};
                              this.importDialogVisible = true
                              this.getUploadList();
                            }
                            refreshData () {
                              this.getUploadList()
                            }
                             async getUploadList () {
                                this.$set(this.loadings, 1, true)
                                let res = await GetUploadTableList(this.uploadTableFrom);
                                this.uploadTableList = res.list;
                                this.uploadTableCount = res.count;
                                this.$set(this.loadings, 1, false)
                            }
                            // upload  Pagination 改变
                            uploadPageChange(e: number) {
                                this.uploadTableFrom.page = e;
                                this.getUploadList();
                            }
                    
                            // upload  pagination size改变
                            uploadPSizeChange(e: number) {
                                this.uploadTableFrom.page = 1;
                                this.uploadTableFrom.rows = e;
                                this.getUploadList();
                            }
                            // 上传成功
                            uploadSuccess(e: resCode) {
                              if (e.errorCode === '0') {
                                this.$Message.success('上传成功!');
                                this.refreshData();
                                this.importDialogVisible = false
                              } else {
                                this.$Message.error(e.errorMsg || '上传失败');
                                this.refreshData();
                              }
                            }
                              `

        break;
      }
      // 导出
      case 5: {
        serviceButtonStr += `
                            <Button type="primary" icon="el-icon-download" size="small" @click="exportFile"  style="margin-left:10px">导出</Button>`
        // 导出
        serviceMethodsStr += `async exportFile() {
                                let ids = [];
                                for (let item of this.selectList) {
                                  // flowId 根据自己业务自行替换
                                  // @ts-ignore
                                  ids.push(item.flowId);
                                }
                                let p = Object.assign({}, this.form, { ids })
                                await ${item.name}(p);
                              }`
        break;
      }
      // 字典表
      case 6: {
        codeStr += `
          this.${item.codeName} = await ${item.name}({});
        `
        break;
      }
      // 查看
      case 7: {
        isDialog = true
        serviceMethodsStr += `
                              async getDetail(e:object) {
                                let res = await ${item.name}(e)
                                this.dialogInfo = res
                              }
                               // 显示修改详情
                              async showDetailDialog(e: rowType) {
                                  // 查看
                                  this.dialogInfo = {}
                                  await this.getDetail(e.row)
                                  this.dialogType = 3
                                  this.detailDialogVisible = true;
                              }
                              `
        serviceVarStr +=`        
                        detailDialogVisible: boolean = false;
                        dialogType: number = 0; // 1新建 2改变 3 查看
                        // dialog详情数据
                        dialogInfo = {}
                        `
        break;
      }
      default:{
        break;
      }
    }
  }        // 获取字典表

  serviceMethodsStr += `
    async getCodeList() {
      ${codeStr}
    }
  `
  strobj.importService = `
  import {${str}} from './service';`
  strobj.service = `
                    import {http} from '@/request'
                    function exportFiles (urls:string, data:object) {
                      let thList = []
                      let ThDoms = document.getElementsByClassName('export-th')
                      for (let item of ThDoms) {
                        let tem = item.dataset.prop.split('-')
                        thList.push({name:tem[0],label:tem[1]})
                      }
                      // @ts-ignore
                      window.open(process.env.VUE_APP_context + urls+"?data="+encodeURI(JSON.stringify(data))+"&labelJson="+encodeURI(JSON.stringify(thList)));
                    }
                    ${serviceStr}`
  strobj.serviceMethodsStr = serviceMethodsStr
  strobj.serviceButtonStr = serviceButtonStr
  strobj.importDataStr = importDataStr
  strobj.serviceVarStr = serviceVarStr
  strobj.initExecFunction = initExecFunction
  strobj.dynamicFilter = dynamicFilter
  return strobj
}

// 生成字典表变量
function generateVar({selectCodeList}:generatorDataType) {
  let str = ``
  for (let item of selectCodeList!) {
    if (item.value && item.value.indexOf('{') > 0) {
      str+= `
            ${item.label}:codeType[]=${item.value};`
    } else {
      str+= `
            ${item.label}:codeType[]=[];`
    }

  }
  return str
  // import {} from './service';
}


function generateTemplate(p:generatorDataType) {
  let genService = generateService(p)
  let genFilter = generateFilter(p)
  let genTableList = generateTableList(p)
  let genDialog = ''
  if (isDialog) {
    genDialog = generateDialog(p)
  }
  let genVar = generateVar(p)
  let templateStr = `<template>
    <div class="container"  @keyup.enter="searchData">
        <Container class="filter">
          <Collapse :value="'1'">
            <CollapseItem title="搜索查询" style="padding-left: 10px" name="1" >
              <Header style="width:100%;height:auto">

                  <Form class="filter-outer" :model="form" :inline="true">
                    ${genFilter.filterStr}
                    ${genService.dynamicFilter}
                    <div class="filter-button">
                        <Button type="primary" size="small" @click="searchData"
                        >查询
                        </Button
                        >
                        <Button type="primary" size="small" @click="resetData">重置</Button>
                    </div>
                 </Form>
              </Header>
            </CollapseItem>
          </Collapse>
        </Container>
        <Container class="table-list" direction="vertical">
            <Header class="table-buttons" height="42" style="text-align: right">
               ${genService.serviceButtonStr}
            </Header>
            <Main style="width:100%">
                <Table tooltip-effect="dark"
                       ref="multipleTable"
                       v-loading="loadings[0]"
                       element-loading-text="拼命加载中"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(255, 255, 255, 0.7)"
                       @selection-change="handleSelectionChange"
                       @sort-change = "sortChange"
                       max-height="513"
                       :border='true'
                       :data="tableList">
                    <TableColumn type="selection" width="55"  align="center" fixed="left"/>
                     ${genTableList}
                </Table>
                <Row justify="center" type="flex">
                    <Pagination
                            style="margin-top:10px"
                            @current-change="pageChange"
                            @size-change="sizeChange"
                            :page-size="15"
                            :total="tableCount"
                            :background="true"
                            :small="true"
                            :page-sizes="[15, 30, 50, 100]"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page="form.page"
                    ></Pagination>
                </Row>
            </Main>
        </Container>
        ${genDialog}
        ${genService.importDataStr}
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Uploader from '@/components/Uploader/index.vue';
    import { setRes } from '@/utils';
    import {
        Button,
        Form,
        FormItem,
        Container,
        Header,
        Main,
        Select,
        Option,
        Row,
        Col,
        Input,
        DatePicker,
        Table,
        TableColumn,
        Pagination,
        Dialog,
        Popover,
        Loading,
        Icon,
        TimeSelect,
        Collapse,
        CollapseItem
    } from 'element-ui';
     ${genService.importService}

    type tableListType = {
        [index: string]: string;
    };

    type rowType = {
        row: object;
        type:string
    };
    type codeType = {
       label:string,
       value: string,
       color?: string
    };

    @Component({
        components: {
            Button,
            Form,
            FormItem,
            Container,
            Header,
            Main,
            Select,
            Option,
            Row,
            Col,
            Input,
            DatePicker,
            Table,
            TableColumn,
            Pagination,
            Uploader,
            Dialog,
            Popover,
            Icon,
            TimeSelect,
            Collapse,
            CollapseItem
        }
    })
    export default class Index extends Vue {
        ${genFilter.filterVarStr}
        $MessageBox: any
        $Message: any
        // @ts-ignore
        context: any = process.env.VUE_APP_context;
        loadings: boolean[] = [false,false]
        //列表list
        tableList = []
        tableCount: number = 0
        //字典表变量
        ${genVar}
        ${genService.serviceVarStr}
        // 过滤条件
        form:any = {page: 1, rows: 15, oi: '', ot: ''};

        // 列表多选list
        selectList = []

        async mounted() {
            ${genService.initExecFunction}
            this.getCodeList();
            this.getList();
        }

        // 增删改查
        ${genService.serviceMethodsStr}

        // 列表多选
        handleSelectionChange(e:[]) {
            this.selectList = e;
        }
        sortChange ({ prop, order }:{prop:string,order:string}) {
            this.form.oi = prop
            this.form.ot = order === 'ascending'?'asc':'desc'
            this.getList();
        }

        // pagination 改变
        pageChange(e: number) {
            this.form.page = e;
            this.getList();
        }

        // pagination size改变
        sizeChange(e: number) {
            this.form.page = 1;
            this.form.rows = e;
            this.getList();
        }

        // 搜索
        searchData() {
            this.form.page = 1;
            this.getList();
        }

        //重置
        resetData() {
            this.form = {page: 1, rows: 15, oi: '', ot: ''};
            this.getList();
        }
        closeDialog(){
          // @ts-ignore
          if (this.$refs["dialogForm"]) {
              this.$refs["dialogForm"].resetFields();
          }
          this.detailDialogVisible=false;
        }
        ${genFilter.filterMethodStr}
    }
</script>

<style lang="scss">
    .container{
        width: 100%;
    }
    .filter, .table-list {
        font-size: 14px;
        padding: 10px;
        box-shadow: 0px 0px 7px rgba(170, 170, 170, 0.5);
        width: 98%;
        margin: 0 auto;
        margin-top: 10px;
        overflow: hidden;
    }

    .dialog-title {
        display: inline-block;
        width: 120px;
        text-align: right;
    }

    .dialog-line {
        height: 46px;
        box-sizing: border-box;
    }

    .filter-outer {
        display: inline-block;
        float: left;
        overfloat: hidden;
        width: 100%;
    }

    .filter-button {
        padding-top: 10px;
        text-align: right;
        float: right;
        width: 150px;
    }

    .warn-text {
        color: red
    }
</style>
`
  downloadFile (templateStr,p.fileName+'.vue')
  downloadFile (genService.service!, 'service.ts')
  isDialog = false
  dynamicTableColumn = ``
  // return templateStr
}

// 下载文件
function downloadFile (text:string,fileName:string) {
  //测试下载
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
export default generateTemplate




