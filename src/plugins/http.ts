import axios from 'axios'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
//将axios封装到类中
class ServiceRequest {
  instance: AxiosInstance//axios的实例将被保存到这里
  constructor(config: AxiosRequestConfig) {//构造器里的config包括baseURL，timeout等
    this.instance = axios.create(config)//创建axios实例
    
    // 设置 post、put 默认 Content-Type
    this.instance.defaults.headers.post['Content-Type'] = 'application/json';
    this.instance.defaults.headers.put['Content-Type'] = 'application/json';

    this.instance.interceptors.request.use(//实例中的请求拦截器
      (config) => {
        //请求成功的拦截
        return config
      },
      (error) => {
        //请求失败的拦截
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(//实例中的响应拦截器
      (response) => {
        //响应成功的拦截
        return response
      },
      (error) => {
       //响应失败的拦截
        return Promise.reject(error)
      }
    )
  }
  request<T>(config: AxiosRequestConfig): Promise<T> {//再次封装request方法
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res:any) => {
          resolve(res.data)//将结果返回出去
        })
        .catch((err) => {
          reject(err)
          return err
        })
    })
  }
  get<T>(url:string,data?:any,config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config,url:url, data:data, method: 'GET' })
  }
  post<T>(url:string,data?:any,config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url:url, data:data, method: 'POST' })
  }
  delete<T>(url:string,data?:any,config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url:url, data:data,method: 'DELETE' })
  }
  patch<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}
const  http:ServiceRequest = new ServiceRequest({
  timeout: 1500
});

export default http;