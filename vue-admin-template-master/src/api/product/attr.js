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