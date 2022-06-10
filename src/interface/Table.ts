export interface PageParam{
    pageNumber: number,
    sizes: Array<Number>,
    pageSize: Number,
    totalElements: Number,
    info?: Object,
    sortList?: Array<SortColumn>,
    searchList?: Array<SearchParamters>
}
export interface Column{
    name: String,
    title: String,
    width?: Number,
    resizable?: Boolean,
    align?:String,
    show?: Boolean,
    sort?: Boolean,
    sortOrder?:String,
    searchType?:String,
    searchDataFormatter?: String,
    searchDataDefault?: String,
    searchDataArray?:String,
    search?: Boolean
}

export interface SortColumn{
    sortIndex: number,
    sortTitle: String,
    sortOrder: String,
    sortName: String,
}
export interface SearchColumn{
    searchName: String,
    searchTitle: String,
    searchType: String,
    searchDataFormatter?: String,
    searchDataDefault?:String,
    searchDataArray?:String,
    searchPlaceholder?: String,
}

export interface SearchParamters{
    operator: String,
    column: String,
    title: String,
    symbol: String,
    data: String,
    searchPlaceholder?: String,
    showdata: Boolean
}

export interface TableProps{
    rootUrl?:String,
    page?: PageParam,
    columns?: Array<Column>,
    optionBtn?:Object
}

