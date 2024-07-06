import { ApiConst } from '../common/api'
import QueryString from 'query-string'

export class ApiFactory {
  
  defaultConfig = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  
  getCredential = config => {
    const extraHeaders = {}
    
    if (this.token !== undefined) {
      extraHeaders.Authorization = `${ApiConst.TOKEN_PREFIX} ${this.token}`
    }

    config.headers = Object.assign(config.headers, extraHeaders)
    return config
  }

  request (config, url) {
    config = this.getCredential(config)
    if(config.headers['Content-Type'] === 'application/json' && config.body) {
      config.body = JSON.stringify(config.body)
    }
    return fetch(process.env.NEXT_PUBLIC_API_BASE_URL + url, config)
      .then(response => {
        if (!response.ok) {
          return response.json()
          .then(err => Promise.reject({
            statusCode: response.status,
            ...err
          }))
        }

        if (response.status === 204) return {};
        return response.json().then(json => {
          return json
        })
      }
    )
  }

  get (url, data, customConfig = null) {
    let config = {}
    config = Object.assign(config, this.defaultConfig, customConfig)
    config.method = 'GET'
    config.body = undefined
    if (data) {
      url += '?' + QueryString.stringify(data)
    }
    return this.request(config, url)
  }

  post (url, data, customConfig = null) {
    const config = Object.assign({}, this.defaultConfig, customConfig)
    config.method = 'POST'
    config.body = data
    return this.request(config, url)
  }

  put (url, data, customConfig = null) {
    const config = Object.assign({}, this.defaultConfig, customConfig)
    config.method = 'PUT'
    config.body = data
    return this.request(config, url)
  }

  patch (url, data, customConfig = null) {
    const config = Object.assign({}, this.defaultConfig, customConfig)
    config.method = 'PATCH'
    config.body = data
    return this.request(config, url)
  }

  delete (url, data, customConfig = null) {
    const config = Object.assign({}, this.defaultConfig, customConfig)
    config.method = 'DELETE'
    config.headers['Content-Length'] = 0;
    config.body = data
    return this.request(config, url)
  }
}

export const Api = new ApiFactory();