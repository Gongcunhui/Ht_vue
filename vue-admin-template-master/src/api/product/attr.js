// 平台属性管理模块
import request from '@/utils/request'

// 获取一级分类的数据
// /admin/product/getCategory1
export const reqCategory1List = () => request.get('/admin/product/getCategory1')

// 获取二级分类的接口
// /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) => request.get(`/admin/product/getCategory2/${category1Id}`)

// 获取三级分类的接口
// /admin/product/getCategory2/{category2Id}
export const reqCategory3List = (category2Id) => request.get(`/admin/product/getCategory2/${category2Id}`)

// 获取 根据123级id获取商品属性数据
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqGetAttrInfo = (category1Id, category2Id, category3Id) => request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)

// 添加属性名和属性值的接口
// /admin/product/saveAttrInfo
export const reqAddOrUpdateAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data })
    // {
    //     "attrName": "string",  //属性名
    //     "attrValueList": [   //属性名中的属性值
    //       {
    //         "attrId": 0,   //属性id
    //         "id": 0,   //
    //         "valueName": "string"  //属性值
    //       }
    //     ],
    //     "categoryId": 0,   //catagory3Id
    //     "categoryLevel": 0,
    //   }