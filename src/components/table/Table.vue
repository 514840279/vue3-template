<template>
    <div style="margin-top:20px;">
        <transition name="el-zoom-in-top">
            <div :class="show == 'page' ? 'transition-box' : null" v-show="show == 'page'">
                <el-row>
                    <el-col :span="24" style="text-align: right;margin-right:10px;">
                        <el-button title="查询" @click="handleShowShearch()" icon="Search" circle size="mini"></el-button>
                        <el-button title="排序" @click="handleShowSort()" v-if="localOptionBtn.sort" icon="Sort" circle size="mini"></el-button>
                        <el-button title="重置" @click="resetTable()" icon="Setting" circle size="mini"></el-button>
                        <el-button title="添加" v-if="localOptionBtn.add" @click="handleAdd()" type="success" icon="CirclePlusFilled" circle size="mini"></el-button>
                        <el-button title="刷新" @click="initTable()" icon="Refresh" circle size="mini"></el-button>
                        <!-- <el-button title="打印" @click="printTable()" icon="Printer" circle size="mini"  ></el-button> -->
                        <!-- <el-button title="导出" icon="Download" circle size="mini"  ></el-button> -->
                        <!-- <TableColumnSelect v-model:columns="showColumns" circle size="mini"></TableColumnSelect> -->
                    </el-col>
                </el-row>
                <!-- <TableSearchParameters v-if="localOptionBtn.search && showSearch" :searchColumns="searchColumns" v-model:searchParameters="searchParameters" @searchTable="initTable"></TableSearchParameters> -->
                <!-- <TableSortParameters v-if="localOptionBtn.sort && showSort" :sortColumns="sortColumns" v-model:sortParameters="sortParameters" @sortTable="initTable"></TableSortParameters> -->
                <div id="Table" ref="print">
                    <el-table id="tableid" v-loading="loading" :data="dataList" style="width: 100%">
                        <el-table-column v-for="(column, ind) in activeColumns" :key="ind" :prop="column.name" :label="column.title" :width="column.width == null ? '' : column.width" :align="column.align == null ? 'left' : column.align" :resizable="column.resizable == null ? false : column.resizable">
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="124">
                            <template #default="scope">
                                <el-button @click="handleUpd(scope.row)" type="success" icon="Edit" circle size="mini" title="修改"></el-button>
                                <el-button @click="handleStateToDown(scope.row)" v-if="scope.row.deleteFlag == 0 || scope.row.deleteFlag == null" type="warning" icon="View" circle size="mini" title="已启用"></el-button>
                                <el-button @click="handleStateToUp(scope.row)" v-if="scope.row.deleteFlag == 1" type="info" icon="View" circle size="mini" title="已禁用"></el-button>
                                <el-button @click="handleDelete(scope.row)" type="danger" icon="Delete" circle size="mini" title="删除"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-if="localOptionBtn.page">
                        <el-pagination class="pagex" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="param.pageNumber" :page-sizes="page.sizes" :page-size="param.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="param.totalElements" :hide-on-single-page="true">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="el-zoom-in-top">
            <div :class="show == 'edit' ? 'transition-box' : null" v-show="show == 'edit'">
                <TableSave v-show="show == 'edit'" :columns="columns" v-model:info="currentRow" @onSave="handleSave" @onCancel="initTable"> </TableSave>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, computed } from 'vue';
import { PageParam, Column, SortColumn, SearchColumn } from '../../interface/Table'
import axios from 'axios';



const parents = withDefaults(defineProps<{
    rootUrl?: String,
    page?: PageParam,
    columns?: Array<Column>,
    optionBtn?: Object
}>(), {
    rootUrl: () => "",
    page: () => {
        return {
            pageNumber: 1,
            sizes: [10, 20, 50, 100],
            pageSize: 10,
            totalElements: 0,
        }
    },
    columns: () => [],
    optionBtn: () => {
        return {
            search: true, // 开启查询功能
            sort: true, // 开启排序功能
            add: true, // 添加
            page: true, // 翻页
            opt: true, // 每条数据后端操作搭配optbtn使用
            optbtn: { // 
                info: true, // 详细
                upd: true, // 修改
                state: true, // 修改表中应有固定字段 delete_flag 默认值为0 逻辑删除字段 执行update 
                del: true, // 删除 执行delete sql
            }
        }
    }

});

//  连接地址 
let url = {
    page: parents.rootUrl + "/page",
    findAll: parents.rootUrl + "/findAll",
    add: parents.rootUrl + "/save",
    upd: parents.rootUrl + "/save",
    del: parents.rootUrl + "/delete",
    delAll: parents.rootUrl + "/deleteAll",
};
// 按钮控制
let localOptionBtn: any = {
    search: true, // 开启查询功能
    sort: true, // 开启排序功能
    add: true, // 添加
    page: true, // 翻页
    opt: true, // 每条数据后端操作搭配optbtn使用
    optbtn: { // 
        info: true, // 详细
        upd: true, // 修改
        state: true, // 修改表中应有固定字段 delete_flag 默认值为0 逻辑删除字段 执行update 
        del: true, // 删除 执行delete sql
    },
},
    // 请求参数
    param: PageParam = {
        pageNumber: 1,
        sizes: [10, 20, 50, 100],
        pageSize: 10,
        totalElements: 0
    },
    // 表加载
    loading: Boolean = false
// 表格数据
let dataList = ref<Array<any>>([]),
    // 编辑的数据
    currentRow = {},
    // 默认展示页面信息
    show = 'page',
    // 绑定显示隐藏columns名称
    showColumns: Array<Column> = [],
    // 搜索columns名称 类型有type= text integer integerrange date datetime  daterange select redio checkbox 
    /*{
        name= name,                                 
        search=true,
        search-type= text/integer/integerrange
        // search-type= date/datetime/daterange
        // search-data-formatter= 'yyyy-MM-dd'/'yyyy-MM-dd HH=mm=ss'
        // search-type= select/redio/checkbox
        // search-data-default= ''  // default value in array
        // search-data-array= ['','']
     }*/
    searchColumns: Array<SearchColumn> = [],
    searchParameters: Array<SearchColumn> = [],
    showSearch: Boolean = false,
    // 排序columns名称
    /*{
        name=name,
        sort= true, // 允许选择排序
        sort-index= 1 // 默认排序优先序
        sort-order：'asc'/desc 
    } */
    sortColumns: Array<SortColumn> = [],
    sortParameters: Array<SortColumn> = [],
    showSort: Boolean = false;

onBeforeMount(() => {
    showColumns = parents.columns;
    localOptionBtn = parents.optionBtn;
    // innt
    init();
    // befor
    initTable();
});


// 初始化参数
function init(): void {
    // 查询条件
    showColumns.forEach((item, index) => {
        // 排序查询条件
        if (item.sort != null) {
            // 默认值是 “asc” 
            let sortOrder = item.sortOrder == null ? 'asc' : item.sortOrder;
            // 添加可排序字段
            sortColumns.push({
                "sortIndex": index,
                "sortName": item.name,
                "sortTitle": item.title,
                "sortOrder": sortOrder
            });
        }

        // 准备查询条件
        if (item.search != null) {
            // 默认值设置
            let searchType = item.searchType == null ? 'text' : item.searchType;
            // 添加可选条件
            searchColumns.push({
                "searchName": item.name,
                "searchTitle": item.title,
                "searchType": searchType,
                "searchDataFormatter": item.searchDataFormatter,
                "searchDataDefault": item.searchDataDefault,
                "searchDataArray": item.searchDataArray,
                "searchPlaceholder": "请输入" + item.title,
            });
        }
        // 默认值设置
        item.show = item.show == null ? true : item.show;
    });
    // 查询框可选控制
    if (searchColumns.length == 0) {
        localOptionBtn.search = false;
    }
    // 排序区域可选控制
    if (sortColumns.length == 0) {
        localOptionBtn.sort = false;
    }
}
// 异步查询表格
function initTable(): void {
    show = 'page';
    loading = true;
    param.sortList = sortParameters;
    param.searchList = searchParameters;

    axios.post(url.page, param).then((reponse) => {
        if (reponse.status == 200 && reponse.data != null && reponse.data.code == 200) {
            dataList.value = reponse.data.data.content;
            var size = reponse.data.data.totalElements;
            if (size > 0 && dataList.value.length == 0) {
                param.pageNumber = param.pageNumber - 1;
                initTable();
            }
            param.totalElements = reponse.data.data.totalElements;
        }
    }).catch((err) => {
        // TODO
    });
    loading = false;
}
// 显示 、隐藏 收索条件框
function handleShowShearch(): void {
    showSort = false;
    showSearch = !showSearch;
}
// 显示 、隐藏 排序条件框
function handleShowSort(): void {
    showSearch = false;
    showSort = !showSort;
}
// 每页大小
function handleSizeChange(val: Number): void {
    param.pageSize = val;
    initTable();
}
// 翻页 
function handleCurrentChange(val: number): void {
    param.pageNumber = val;
    initTable();
}
// 更新行> 更新页面数据传递
function handleUpd(row: Object): void {
    currentRow = row;
    show = 'edit';
}
// 添加行
function handleAdd(): void {
    currentRow = {};
    show = 'edit';
}
// 修改数据
function handleSave(): void {
    upd(currentRow);
}
// 删除单行数据
function handleDelete(row: Object): void {
    loading = true;
    axios.post(url.del, row).then((reponse) => {
        debugger
        if (reponse.status == 200 && reponse.data != null && reponse.data.code == 200) {
            initTable();
        }
    }).catch((err) => {
        // TODO
    });
}
// 修改状态  “显示”
function handleStateToUp(row: any): void {
    row.deleteFlag = 0;
    upd(row);
}
// 修改状态 “隐藏”
function handleStateToDown(row: any): void {
    row.deleteFlag = 1;
    upd(row);
}
// 数据更新
function upd(row: any): void {

    loading = true;
    axios.post(url.upd, row).then((reponse) => {
        if (reponse.data.code == 200) {
            initTable();
        }
    }).catch((err) => {
        // TODO
    });
}
// 参数重置
function resetTable(): void {
    loading = true;
    showSearch = false;
    showSort = false;
    param = parents.page;
    sortParameters = [];
    searchParameters = [];
    initTable();
    // showSort = true;
    showSearch = true;
}
// 打印表格
function printTable(): void {
    // $refs.print
}

const activeColumns = computed<Column[]>(() => {
    let temp: Column[] = new Array();
    showColumns.forEach(column => {
        if (column.show) {
            temp.push(column);
        }
    });
    return temp;
})

</script>

<style scoped>
</style>