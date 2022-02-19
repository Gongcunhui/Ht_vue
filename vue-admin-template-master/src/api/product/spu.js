import request from '@/utils/request'

//获取spu列表的数据
// /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 获取spu信息
// /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌的接口
// /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () => request.get('/admin/product/baseTrademark/getTrademarkList')

// 获取spu图片
// /admin/product/spuImageList/{spuId}
export const reqImageList = (spuId) => request.get(`/admin/product/spuImageList/${spuId}`)

// 获取平台的所有销售属性  ---最多只有3个
// /admin/product/baseSaleAttrList
export const reqSaleAttrList = () => request.get('/admin/product/baseSaleAttrList')


// 修改spu || 添加spu ：对于修改或者添加：携带给服务器参数大致是一样的，唯一的去别是携带参数是否带id
// /admin/product/updateSpuInfo
export const reqAddOrUpdateSpu = (spuInfo) => {
    // 带有id，则是修改spu
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
    } else {
        // 不带id 则是添加spu
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    }
}

// 删除spu的接口
// /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })