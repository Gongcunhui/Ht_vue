// 这个模块是获取品牌管理的数据的模块
import request from '@/utils/request'

// 获取品牌列表的接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMark = (page, limit) => request.get(`/admin/product/baseTrademark/${page}/${limit}`)

// 添加品牌的接口
// /admin/product/baseTrademark/save  携带2个参数：品牌名称、品牌logo
// 切记：对于新增的品牌，不需要携带id，id由服务器生成
// 修改品牌的接口
// /admin/product/baseTrademark/update  携带3个参数：id logoUrl tmName
// 切记：需要带上id
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        return request({ url: ' /admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }
}

// 删除品牌的接口
// /admin/product/baseTrademark/remove/{id}
export const reqDelteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })