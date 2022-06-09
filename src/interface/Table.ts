export interface PageParam{
    pageNumber: number,
    sizes: Array<Number>,
    pageSize: Number,
    totalElements: Number,
    info?: Object,
    sortList?: Array<SortColumn>,
    searchList?: Array<SearchColumn>
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

export interface TableProps{
    rootUrl?:String,
    page?: PageParam,
    columns?: Array<Column>,
    optionBtn?:Object
}

