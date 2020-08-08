<template>
    <div class="container">
        <Container class="filter">
            <Collapse :value="'1'">
                <CollapseItem title="搜索查询" style="padding-left: 10px" name="1" >
            <Header style="width:100%;height:auto">

                <Form class="filter-outer" :model="filters" :inline="true">
                    <FormItem class="filter-item" label="文件名称:" style="margin-right: 26px">
                        <Input
                                v-model="filters.generatorTitleLike"
                                size="small"
                                placeholder="请输入文件名称"
                        />
                    </FormItem>
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
            <Main style="width:100%">
                <Header class="table-buttons" height="42" style="text-align: right;margin-bottom: 10px">
                    <Button type="success" @click="addList(1)" size="small">新建</Button>
                </Header>
                <Table tooltip-effect="dark"
                       ref="multipleTable"
                       :border='true'
                       :data="tableList">
                    <TableColumn prop="generatorTitle" align="center" label="文件名称"/>
                    <TableColumn prop="data" label="操作" fixed="right" align="center">
                        <template slot-scope="scope">
                            <Button size="mini" type="warning" @click="addList(scope)">编辑</Button>
                            <Button size="mini" type="danger" @click="deleteItem(scope)">删除</Button>
                        </template>
                    </TableColumn>
                </Table>
                <Row justify="center" type="flex">
                    <Pagination
                            style="margin-top:10px"
                            @current-change="pageChange"
                            @size-change="sizeChange"
                            :pageNo-size="10"
                            :total="tableCount"
                            :background="true"
                            :small="true"
                            :page-sizes="['15', '30', '50', '100']"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-pageNo="filters.pageNo"
                    ></Pagination>
                </Row>
            </Main>
        </Container>
        <Dialog :visible.sync="detailDialogVisible" width="1650px" :before-close="beforeClose">
            <!--            头部-->
            <p slot="title" style="font-size:18px;border-bottom:1px solid #ddd;padding-bottom:10px">
                代码配置
            </p>
            <!--                内容-->
            <div class="dialog-content" style="padding:0 20px">
                <Form slot="form" size="small" :inline="true" label-width="90px">
                    <Collapse v-model="activeNames">
                        <CollapseItem title="一、基本信息" name="1">
                            <Row>
                                <Col :span="6">
                                    <FormItem label="模板文件名称:" label-width="130px">
                                        <Input type="text" placeholder="" v-model="fileName"
                                               style="width: 100%"></Input>
                                    </FormItem>
                                </Col>
                                <Col :span="10" style="margin-left: 20px">
                                    <FormItem label="模板文件JSON:" label-width="130px" id='textarea'>
                                        <Input type="textarea" v-model="fileData"></Input>
                                    </FormItem>
                                </Col>
                                <Col :span="2" style="margin-left: 20px">
                                    <a href="javascript:" @click="downloadFile"
                                       style="line-height: 40px;text-decoration: underline">模板JSON下载</a>
                                </Col>
                                <Col :span="2">
                                    <Button type="primary" @click="importDatas(fileData)">执行JSON</Button>
                                </Col>
                            </Row>
                        </CollapseItem>
                        <CollapseItem title="二、接口" name="2">
                            <Row :gutter="20" :key="interfaceItemIndex"
                                 v-for="(interfaceItem, interfaceItemIndex) in interfaceList">
                                <FormItem :label="interfaceItemIndex+1 + '、接口名:'">
                                    <Input type="text" placeholder="英文首字母大写" v-model="interfaceItem.name"></Input>
                                </FormItem>
                                <FormItem label="接口地址:">
                                    <Input type="text" placeholder="请输入url" v-model="interfaceItem.url"></Input>
                                </FormItem>
                                <FormItem label="接口类型:">
                                    <Select placeholder="选择类型" v-model="interfaceItem.type"
                                            @change="interfaceTypeChange(interfaceItemIndex)">
                                        <Option v-for="item in interfaceTypelist" :disabled="item.disabled"
                                                :key="item.value" :label="item.label" :value="item.value"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="字典变量:" v-if="interfaceItem.codeFlage">
                                    <Input type="text" placeholder="请输入字典表变量名称"
                                           v-model="interfaceItem.codeName"></Input>
                                </FormItem>
                                <FormItem label="动态加载:" v-if="interfaceItem.isShowSwitch">
                                    <RadioGroup v-model="interfaceItem.isDynamicTable">
                                        <Radio label="yes">开启</Radio>
                                        <Radio label="no">关闭</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <FormItem>
                                    <Button icon="el-icon-delete-solid" type="danger"
                                            @click="deleteInterfaceIte(interfaceItemIndex)"/>
                                    <Button icon="el-icon-document-add" type="primary"
                                            @click="addInterfaceItem(interfaceItemIndex)"/>
                                </FormItem>
                            </Row>
                        </CollapseItem>
                        <CollapseItem title="三、自定义字典表" name="3">
                            <Row :gutter="20" :key="codeIndex" v-for="( code, codeIndex) in codeList">
                                <FormItem :label="codeIndex+1 + '、变量名:'">
                                    <Input type="text" placeholder="请输入字典表变量名称" v-model="code.label"></Input>
                                </FormItem>
                                <FormItem label="字典表:">
                                    <Input type="text" placeholder="例:[{label:'名称',value:'值',color:'字典颜色'}]"
                                           v-model="code.value"></Input>
                                </FormItem>
                                <FormItem>
                                    例:[{label:'名称',value:'值',color:'字典颜色'}]
                                </FormItem>
                                <FormItem>
                                    <Button icon="el-icon-delete-solid" type="danger"
                                            @click="deleteCodeItem(codeIndex)"/>
                                    <Button icon="el-icon-document-add" type="primary" @click="addCodeItem(codeIndex)"/>
                                </FormItem>
                            </Row>
                        </CollapseItem>
                        <CollapseItem title="四、表格信息" name="4">
                            <Row :gutter="20" :key="tableIndex" v-for="( tableItem, tableIndex) in tableParamList">
                                <FormItem :label="tableIndex+1 + '、类型:'">
                                    <Select style="width: 140px"  placeholder="变量类型" v-model="tableItem.type"
                                            @change="columeTypeChange(tableIndex, 2)" @focus="codeFocus">
                                        <Option v-for="item in searcherTypelist" :key="item.value" :label="item.label"
                                                :value="item.value"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="显示名称:">
                                    <Input style="width: 140px"  type="text" placeholder="请输入名称" v-model="tableItem.name"></Input>
                                </FormItem>
                                <FormItem label="变量名称:">
                                    <Input  type="text" placeholder="请输入变量名称" v-model="tableItem.value"></Input>
                                </FormItem>
                                <FormItem label="字典变量:" v-if="tableItem.codeFlage">
                                    <Select style="width: 140px"  placeholder="选择字典表变量名称" v-model="tableItem.code"
                                            @change="tableTypeChange(tableIndex)" @focus="codeFocus">
                                        <Option v-for="item in selectCodeList" :key="item.value" :label="item.label"
                                                :value="item.label"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="定位:" label-width="50px">
                                    <RadioGroup v-model="tableItem.position">
                                        <Radio label="left">左</Radio>
                                        <Radio label="right">右</Radio>
                                        <Radio label="no">无</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <FormItem style="width: 50px">
                                    <Checkbox label="排序:" v-model="tableItem.sortable"/>
                                </FormItem>
                                <FormItem>
                                    <Button icon="el-icon-delete-solid" type="danger"
                                            @click="deleteTableParamItem(tableIndex)"/>
                                    <Button icon="el-icon-document-add" type="primary"
                                            @click="addTableParamItem(tableIndex)"/>
                                </FormItem>
                            </Row>
                            <Row :gutter="20">
                                <FormItem label="操作按钮:">
                                    <CheckboxGroup v-model="tableCheckList"  @change="detailChange">
                                        <Checkbox label="查看"/>
                                        <Checkbox label="编辑"/>
                                    </CheckboxGroup>
                                </FormItem>
                            </Row>
                        </CollapseItem>
                        <CollapseItem title="五、过滤器信息" name="5">
                            <Row :gutter="20">
                                <FormItem label="操作按钮:">
                                    <Button @click="cogradientTableInfo(1)" type="primary">
                                        同步表格信息
                                    </Button>
                                </FormItem>
                            </Row>
                            <Row :gutter="20" :key="searcherIndex"
                                 v-for="( searcher, searcherIndex) in searcherParamList">
                                <FormItem :label="searcherIndex+1 + '、类型:'">
                                    <Select style="width: 140px"  placeholder="选择类型" v-model="searcher.type"
                                            @change="columeTypeChange(searcherIndex, 1)">
                                        <Option v-for="item in searcherTypelist" :key="item.value" :label="item.label"
                                                :value="item.value"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="显示名称:">
                                    <Input style="width: 140px"  type="text" placeholder="请输入名称" v-model="searcher.name"></Input>
                                </FormItem>
                                <FormItem label="变量名称:">
                                    <Input  type="text" placeholder="请输入变量名称" v-model="searcher.value"></Input>
                                </FormItem>
                                <FormItem label="字典变量:" v-if="searcher.codeFlage">
                                    <Select style="width: 140px"  placeholder="选择字典表变量名称" v-model="searcher.code" @focus="codeFocus">
                                        <Option v-for="item in selectCodeList" :key="item.value" :label="item.label"
                                                :value="item.label"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem>
                                    <Button icon="el-icon-delete-solid" type="danger"
                                            @click="deleteSearcherChildParamItem(searcherIndex)"/>
                                    <Button icon="el-icon-document-add" type="primary"
                                            @click="addSearcherChildParamItem(searcherIndex)"/>
                                </FormItem>
                            </Row>
                        </CollapseItem>
                        <CollapseItem title="六、增改查信息" name="6">
                            <Row :gutter="20">
                                <FormItem label="操作按钮: ">
                                    <Button @click="cogradientTableInfo(2)" type="primary">
                                        同步表格信息
                                    </Button>
                                </FormItem>
                            </Row>
                            <Row :gutter="20" :key="detailIndex" v-for="( detailItem, detailIndex) in detailParamList">
                                <FormItem :label="detailIndex+1 + '、类型:'">
                                    <Select  style="width: 140px" placeholder="变量类型" v-model="detailItem.type"
                                            @change="columeTypeChange(detailIndex, 3)" @focus="codeFocus">
                                        <Option v-for="item in searcherTypelist" :key="item.value" :label="item.label"
                                                :value="item.value"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem  label="显示名称:">
                                    <Input style="width: 140px" type="text" placeholder="请输入名称" v-model="detailItem.name"></Input>
                                </FormItem>
                                <FormItem label="变量名称:">
                                    <Input type="text" placeholder="请输入变量名称" v-model="detailItem.value"></Input>
                                </FormItem>
                                <FormItem label="字典变量:"  v-if="detailItem.codeFlage">
                                    <Select style="width: 140px"  placeholder="选择字典表变量名称" v-model="detailItem.code" @focus="codeFocus">
                                        <Option v-for="item in selectCodeList" :key="item.value" :label="item.label"
                                                :value="item.value"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="行内个数:">
                                    <Input type="text"  style="width: 80px" v-model="detailItem.count"></Input>
                                </FormItem>
                                <FormItem label="是否必选:">
                                    <RadioGroup v-model="detailItem.isNeed">
                                        <Radio label="yes">是</Radio>
                                        <Radio label="no">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <FormItem>
                                    <Button icon="el-icon-delete-solid" type="danger"
                                            @click="deleteDialogParamItem(detailIndex)"/>
                                    <Button icon="el-icon-document-add" type="primary"
                                            @click="addDialogParamItem(detailIndex)"/>
                                </FormItem>
                            </Row>
                        </CollapseItem>
                    </Collapse>

                </Form>

            </div>
            <!--            尾部-->
            <div slot="footer" class="dialog-footer">
                <Button @click="cancelDialog" size='small'>取消</Button>
                <Button @click="downloadConfigFile" size='small' type="primary">JSON配置文件下载</Button>
                <Button @click="saveData" size='small' type="primary">保存</Button>
                <Button @click="generatorCode" size='small' type="primary">保存并下载</Button>
            </div>
        </Dialog>

    </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {formatDate} from '@/utils';
    import {cloneDeep} from 'lodash'
    // @ts-ignore
    import InitData from './components/testData.json'
    import generateTemplate from './components/generatorFile'
    import {SubmitData, GetDataList, DeleteData, ChangeData} from './service';
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
        Message,
        Popover,
        Loading,
        MessageBox,
        TimeSelect,
        Collapse,
        CollapseItem,
        CheckboxGroup,
        Checkbox,
        RadioGroup,
        Radio,
        Icon
    } from 'element-ui';

    type rowType = {
        row: any;
        type: string
    };
    type tableReturnType = {
        result: {
            results: {
                results: object[]
            }
            totalRecord: number
        }
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
            Dialog,
            Popover,
            TimeSelect,
            Collapse,
            CollapseItem,
            CheckboxGroup,
            Checkbox,
            RadioGroup,
            Radio,
            Icon
        }
    })
    export default class Index extends Vue {
        // @ts-ignore
        context: any = process.env.VUE_APP_context;
        detailDialogVisible: boolean = false;
        isUpdate: boolean = false;
        activeNames = ['1', '2', '3', '4', '5', '6']
        //列表list
        tableList: any = []
        tableCount: number = 0
        // 过滤条件
        form = {}
        filters = {pageNo: 0, pageSize: 15, oi: '', ot: '', generatorTableUrl: 'new'}
        // 接口类型
        interfaceTypelist: { label: string, value: number, disabled?: boolean }[] = [{
            label: '列表数据',
            value: 0
        }, {
            label: '列表增',
            value: 1
        }, {
            label: '列表删',
            value: 2
        }, {
            label: '列表改',
            value: 3
        }, {
            label: '列表导入',
            value: 4
        }, {
            label: '列表导出',
            value: 5
        }, {
            label: '字典表接口',
            value: 6
        }, {
            label: '查看详情',
            value: 7
        }]
        // 过滤器类型
        searcherTypelist = [
            {
                label: 'Select',
                value: 0
            }, {
                label: 'Input',
                value: 1
            }, {
                label: 'TimeSelect',
                value: 2
            }, {
                label: 'DatePicker',
                value: 3
            }, {
                label: 'DateRangePicker',
                value: 4
            }
        ]
        fileName = '' // 1.文件名称
        fileData = '' // 模板json数据
        interfaceList: interfaceListType = [{}] // 2.接口块信息
        codeList: codeListType = [{}] // 3.字典表块数据
        selectCodeList: selectCodeListType = [{}] // 可供searcher选择的字典表
        searcherParamList: searcherParamListType = [{}] // 4.详细数据中的搜索数据
        tableParamList: tableParamListType = [{position: 'no'}] // 5.详细数据中的表格数据
        tableCheckList: tableCheckListType = [] // 是否有删除查看按钮
        detailParamList: detailParamListType = [{isNeed:'no'}] // 6.详细数据中的详情数据
        detailData = {} // 详情数据

        async mounted() {
            this.getList();
            this.initKeyEvent()

        }

        initKeyEvent () {
            let _this = this
            document.addEventListener("keydown", function(e) {
                //可以判断是不是mac，如果是mac,ctrl变为花键
                //event.preventDefault() 方法阻止元素发生默认的行为。
                if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                    e.preventDefault();
                    if (_this.detailDialogVisible) {
                        _this.saveData()
                    }
                }
            }, false);
        }

        async getList() {
            let load = Loading.service({
                lock: true,
                text: 'Loading...',
                spinner: 'el-icon-loading',
                target: '.el-main',
                background: 'rgba(255, 255, 255, 0.7)',
            });
            // let p = Object.assign({}, this.form);
            let res: tableReturnType = await GetDataList(this.filters);
            this.tableList = res.result.results;
            this.tableCount = res.result.totalRecord;
            load.close();
        }

        // pagination 改变
        pageChange(e: number) {
            this.filters.pageNo = e;
            this.getList();
        }

        // pagination size改变
        sizeChange(e: number) {
            this.filters.pageSize = e;
            this.getList();
        }

        // 搜索
        searchData() {
            this.filters.pageNo = 0;
            this.getList();
        }

        //重置
        resetData() {
            this.filters = {pageNo: 0, pageSize: 15, oi: '', ot: '', generatorTableUrl: 'new'}
            this.getList();
        }

        importDatas(item?: any) {
            // 暂时先使用文件
            let temData = JSON.parse(item)
            // let temData = JSON.parse(this.fileData)
            this.fileName = temData.fileName
            this.interfaceList = temData.interfaceList
            this.codeList = temData.codeList
            this.searcherParamList = temData.searcherParamList
            this.tableParamList = temData.tableParamList
            this.tableCheckList = temData.tableCheckList
            this.detailParamList = temData.detailParamList
        }

        initData() {
            this.fileName = ''
            this.interfaceList = [{}]
            this.codeList = [{}]
            this.searcherParamList = [{}]
            this.tableParamList = [{position: 'no'}]
            this.tableCheckList = []
            this.detailParamList = [{isNeed:'no'}]
        }

        addList(item: rowType) {
            this.initData()
            console.log(item)
            if (item.row) {
                this.isUpdate = item.row
                this.importDatas(item.row.generatorSearcher)
            } else {
                this.isUpdate = false
            }
            this.diffArray(this.interfaceTypelist, this.interfaceList)
            this.detailDialogVisible = true
        }

        async cancelDialog() {
            this.beforeClose(()=>{
                this.detailDialogVisible = false
            })

        }

        async beforeClose(done:()=>void) {
            MessageBox.confirm('是否保存信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(async () => {
                await this.saveData()
            }).catch(() => {
                done()
            });
        }

        // 提交数据
        async saveData() {
            this.formatData()
            let p: any = {}
            p.generatorTitle = this.fileName
            p.generatorSearcher = JSON.stringify(this.detailData)
            p.generatorTime = formatDate()
            p.generatorTableUrl = 'new'
            let res: any = {}
            if (this.isUpdate) {
                res = await ChangeData(Object.assign({}, this.isUpdate, p))
            } else {
                res = await SubmitData(p)
            }
            if (res.result.updateCount === 1) {
                Message.success('操作成功')
                // this.detailDialogVisible = false
                this.searchData()
            } else {
                Message.success('操作失败')
            }
        }

        // 删除
        async deleteItem(item: rowType) {
            await MessageBox.confirm('确认删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            })
            const res = await DeleteData(item.row)
            if (res.result.updateCount === 1) {
                Message.success('删除成功')
                this.searchData()
            } else {
                Message.error('删除失败')
            }
        }

        codeFocus() {
            let codeInterfaceList = []
            for (let item of this.interfaceList) {
                if (item.type === 6) {
                    codeInterfaceList.push({
                        label: item.codeName,
                        value: item.name
                    })
                }
            }
            this.selectCodeList = [...this.codeList, ...codeInterfaceList]
        }

        //添加一个接口

        addInterfaceItem() {
            this.interfaceList.push({isDynamicTable: 'no'})
        }

        //删除一个接口
        deleteInterfaceIte(index: number) {
            if (this.interfaceList.length === 1) {
                return false
            }
            this.interfaceList.splice(index, 1)
            this.diffArray(this.interfaceTypelist, this.interfaceList)
            this.isDetailOk()
        }

        // 添加一个字典表

        addCodeItem() {
            this.codeList.push({})
            console.log(this.codeList)
        }

        //删除一个字典表
        deleteCodeItem(index: number) {
            if (this.codeList.length === 1) {
                return false
            }
            this.codeList.splice(index, 1)
        }

        // 添加一项搜索
        addSearcherChildParamItem() {
            this.searcherParamList.push({})
        }

        // 删除一项搜索
        deleteSearcherChildParamItem(index: number) {
            if (this.searcherParamList.length === 1) {
                return false
            }
            this.searcherParamList.splice(index, 1)
        }

        // 添加一项tableItem
        addTableParamItem() {
            this.tableParamList.push({position: 'no'})
        }

        // 删除一项tableItem
        deleteTableParamItem(index: number) {
            if (this.tableParamList.length === 1) {
                return false
            }
            this.tableParamList.splice(index, 1)
        }

        // 添加一项dialog
        addDialogParamItem() {
            this.detailParamList.push({isNeed:'no'})
        }

        // 删除一项dialog
        deleteDialogParamItem(index: number) {
            if (this.detailParamList.length === 1) {
                return false
            }
            this.detailParamList.splice(index, 1)
        }

        // 同步表格和详情的信息
        cogradientTableInfo(i: number) {
            if (i === 1) {
                this.searcherParamList = cloneDeep(this.tableParamList)
            } else {
                this.detailParamList = cloneDeep(this.tableParamList)
            }

        }

        // 过滤器字典类型改变事件
        columeTypeChange(e: number, i: number) {
            // i = 1 search
            // i = 2 table
            // i = 3
            let tem = [this.searcherParamList[e], this.tableParamList[e], this.detailParamList[e]]
            let item = tem[i - 1]
            if (item.type === 0) {
                item.codeFlage = true
            } else {
                item.codeFlage = false
            }
        }

        // 列表字典选择改变事件
        tableTypeChange(e: number) {
            let tableItem = this.tableParamList[e]
            if (tableItem.type === 0) {
                tableItem.codeFlage = true
            } else {
                tableItem.codeFlage = false
            }
        }

        // 接口类型改变事件
        interfaceTypeChange(e: number) {
            let interfaceItem = this.interfaceList[e]
            if (interfaceItem.type === 0) {
                interfaceItem.isShowSwitch = true
                // interfaceItem.isDynamicTable = 'no'
            } else if (interfaceItem.type === 6) {
                interfaceItem.codeFlage = true
            } else {
                interfaceItem.codeFlage = false
                this.diffArray(this.interfaceTypelist, this.interfaceList)
            }
        }

        //俩数组取非
        diffArray(a1: { label: string, value: number, disabled?: boolean }[], a2: interfaceListType) {
            let a: any[] = []
            let b: any[] = []
            for (let i = 0; i < a2.length; i++) {
                if (a2[i].type !== 6) {
                    a[a2[i].type!] = true;
                }
            }

            for (let i = 0; i < a1.length; i++) {
                if (a[a1[i].value]) {
                    a1[i].disabled = true
                } else {
                    a1[i].disabled = false
                }
            }
            return b
        }
        detailChange () {
            this.isDetailOk()
        }
        isDetailOk () {
            let e = this.tableCheckList
            let f = true
            for (let item of e) {
                if (item === '查看') {
                    for (let interfaceItem of this.interfaceList) {
                        if (interfaceItem.type === 7) {
                            return
                        }
                    }
                    if (e.length === 1) {
                        this.tableCheckList = []
                    } else {
                        this.tableCheckList = ['编辑']
                    }
                    f = false
                    Message.error('请添加查看接口')
                    return;
                } else if (item === '编辑') {
                    for (let interfaceItem of this.interfaceList) {
                        if (interfaceItem.type === 3) {
                            return
                        }
                    }
                    if (e.length === 1) {
                        this.tableCheckList = []
                    } else {
                        this.tableCheckList = ['查看']
                    }
                    f = false
                    Message.error('请添加修改接口')
                    return;
                }
            }
            return f
        }

        // 生成代码
        generatorCode() {
            this.formatData()
            generateTemplate(Object.assign({}, this.detailData, {selectCodeList: this.selectCodeList}))
            this.saveData()
            this.detailDialogVisible =false
        }

        formatData() {
            this.codeFocus()
            let p: generatorDataType = {}
            p.fileName = this.fileName //1
            p.interfaceList = this.interfaceList //2接口
            p.codeList = this.codeList // 3字典
            p.searcherParamList = this.searcherParamList // 4过滤器
            p.tableParamList = this.tableParamList // 5列表
            p.detailParamList = this.detailParamList // 6详情
            p.tableCheckList = this.tableCheckList // 7列表的操作按钮
            this.detailData = p
        }

        downloadConfigFile() {
            this.formatData()
            this.downloadFile('config.json', JSON.stringify(this.detailData))
        }

        downloadFile(name = 'JSON配置模板.json', text = JSON.stringify(InitData)) {
            //测试下载
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', name);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }
</script>

<style lang="scss">
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
        box-sizing: border-box;
        margin-bottom: 20px;
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
