/*
包含所有品牌管理的接口请求函数
*/
import request from '@/utils/request'

const BASE_PATH = '/admin/product/baseTrademark'

export default {

  /*
  获取品牌全部列表或者分页列表
  GET /admin/product/baseTrademark/{page}/{limit}
  GET /admin/product/baseTrademark/getTrademarkList
  */
  getList(page, limit) {
    if (page && limit) {
      return request({
        url: `${BASE_PATH}/${page}/${limit}`,
        method: 'GET',
      })
    } else {
      return request.get('/admin/product/baseTrademark/getTrademarkList')
    }
  },

  /*
  添加品牌
  POST /admin/product/baseTrademark/save
  */
  add (trademark) {
    return request({
      url: `${BASE_PATH}/save`,
      method: 'POST',
      data: trademark
    })
    // return request.post(`${BASE_PATH}/update`, trademark)
  },

  /*
  更新品牌
  PUT /admin/product/baseTrademark/update
  */
  update (trademark) {
    return request({
      url: `${BASE_PATH}/update`,
      method: 'PUT',
      data: trademark
    })
    // return request.put(`${BASE_PATH}/update`, trademark)
  },

  /*
  删除品牌
  DELETE /admin/product/baseTrademark/remove/{id}
  */
  remove (id) {
    return request({
      url: `${BASE_PATH}/remove/${id}`,
      method: 'delete',
    })
    // return request.delete(`${BASE_PATH}/remove/${id}`)
  },
}
