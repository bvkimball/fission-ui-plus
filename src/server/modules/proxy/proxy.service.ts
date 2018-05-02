import axios, { AxiosResponse } from 'axios';
import { Component as Injectable } from '@nestjs/common';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.data;
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  // error.response = response;
  throw error;
}

function buildFunction(item) {
  return {
    kind: 'Function',
    apiVersion: 'fission.io/v1',
    metadata: {
      name: item.name,
      namespace: (item.namespace || 'default'),
      resourceVersion: item.version
    },
    spec: {
      environment: {
        name: item.environment,
        namespace: (item.namespace || 'default')
      },
      package: {
        packageref: {
          name: item.package.name,
          namespace: (item.package.namespace || 'default'),
          resourceVersion: item.package.resourceVersion
        }
      }
    }
  };
}


function buildPackage(item) {
  return {
    kind: 'Package',
    apiVersion: 'fission.io/v1',
    metadata: {
      name: item.name,
      namespace: (item.namespace || 'default')
    },
    spec: {
      environment: {
        name: item.environment,
        namespace: (item.namespace || 'default')
      },
      deployment: { type: 'literal', literal: item.literal || '' }
    }
  };
}

@Injectable()
export class ProxyService {
  basePath = 'http://192.168.99.100:31313/v2/';
  routerPath = 'http://192.168.99.100:30419/';

  async getEnvironments() {
    return axios
      .get(`${this.basePath}environments`)
      .then(checkStatus)
      .then(parseJSON);
  }
  async getEnvironment(name) {
    return axios
      .get(`${this.basePath}environments/${name}`)
      .then(checkStatus)
      .then(parseJSON);
  }
  async removeEnvironment(environment) {
    return axios
      .delete(`${this.basePath}environments/${environment.name}`)
      .then(checkStatus)
      .then(parseJSON);
  }
  async updateEnvironment(environment) {
    return axios
      .put(`${this.basePath}environments/${environment.name}`, {
        metadata: { name: environment.name },
        runContainerImageUrl: environment.image
      })
      .then(checkStatus)
      .then(parseJSON)
      .then(response => ({
        runContainerImageUrl: environment.image,
        metadata: response
      }));
  }
  async createEnvironment(environment) {
    return axios
      .post(`${this.basePath}environments`, {
        metadata: { name: environment.name },
        runContainerImageUrl: environment.image
      })
      .then(checkStatus)
      .then(parseJSON)
      .then(response => ({
        runContainterImageUrl: environment.image,
        metadata: response
      }));
  }

  async getPackage(name: string): Promise<any> {
    const fn: any = await this.getFunction(name);
    const result: AxiosResponse = await axios.get(
        `${this.basePath}packages/${fn.spec.package.packageref.name}`
    );
    return result.data;
  }

  async getPackageRaw(name: string): Promise<any> {
    const fn: any = await this.getFunction(name);
    const result: AxiosResponse = await axios.get(
        `${this.basePath}packages/${fn.spec.package.packageref.name}?raw=true`
    );
    return result.data;
  }

  async postPackage(item) {
    const pkg = buildPackage(item);
    console.log('pkg', pkg);
    return axios
      .post(`${this.basePath}packages`, pkg)
      .then(checkStatus)
      .then(parseJSON);
  }

  async putPackage(item) {
    return axios
      .put(`${this.basePath}packages/${item.name}`, buildPackage(item))
      .then(checkStatus)
      .then(parseJSON);
  }

  async removePackage(item) {
    try {
      const result = await axios.delete(`${this.basePath}packages/${item.name}`).catch(err => true);
      return result;
    } catch (err) {
      return Promise.resolve(true);
    }
  }

  async getFunctions() {
    return axios
      .get(`${this.basePath}functions`)
      .then(checkStatus)
      .then(parseJSON);
  }

  async getFunction(name) {
    return axios
      .get(`${this.basePath}functions/${name}`)
      .then(checkStatus)
      .then(parseJSON);
  }

  async removeFunction(item) {
    return axios
      .delete(`${this.basePath}functions/${item.name}`)
      .then(checkStatus)
      .then(parseJSON);
  }

  async postFunction(item) {
    item.package = await this.postPackage(item);
    const fn: any = buildFunction(item);
    console.log('FUN', fn);
    return axios
      .post(`${this.basePath}functions`, fn)
      .then(checkStatus)
      .then(parseJSON);
  }

  async putFunction(item) {
    console.log('Remove');
    const removed = await this.removePackage(item);
    item.package = await this.postPackage(item);
    console.log('Create', item.package);
    const fn: any = buildFunction(item);
    console.log('FUN', JSON.stringify(fn));
    return axios
      .put(`${this.basePath}functions/${item.name}`, buildFunction(item))
      .then(checkStatus)
      .then(parseJSON);
  }

  async getTriggersHttp() {
    return axios
      .get(`${this.basePath}triggers/http`)
      .then(checkStatus)
      .then(parseJSON);
  }

  async getTriggerHttp(name) {
    return axios
      .get(`${this.basePath}triggers/http/${name}`)
      .then(checkStatus)
      .then(parseJSON);
  }

  async removeTriggerHttp(item) {
    return axios
      .delete(`${this.basePath}triggers/http/${item.metadata.name}`)
      .then(checkStatus)
      .then(parseJSON);
  }

  async postTriggerHttp(item) {
    return axios
      .post(`${this.basePath}triggers/http`, item)
      .then(checkStatus)
      .then(parseJSON);
  }

  async putTriggerHttp(item) {
    return axios
      .post(`${this.basePath}triggers/http/${item.metadata.name}`, item)
      .then(checkStatus)
      .then(parseJSON);
  }

  async restRequest(url, method, headers, params, body) {
    return axios({
      method: method.toLowerCase(),
      url: `${this.routerPath}${url}`,
      headers,
      params,
      data: body
    })
    .then(checkStatus)
    .then(parseJSON)
    .catch(e => e.response);
  }

  async getKubeWatchers() {
    return axios
      .get(`${this.basePath}watches`)
      .then(checkStatus)
      .then(parseJSON);
  }
  async removeKubeWatcher(item) {
    return axios
      .delete(`${this.basePath}watches/${item.metadata.name}`)
      .then(checkStatus)
      .then(parseJSON);
  }
  async postKubeWatcher(item) {
    return axios
      .post(`${this.basePath}watches`, item)
      .then(checkStatus)
      .then(parseJSON);
  }

  async getTriggersTimer() {
    return axios
      .get(`${this.basePath}triggers/time`)
      .then(checkStatus)
      .then(parseJSON);
  }
  async removeTriggerTimer(item) {
    return axios
      .delete(`${this.basePath}triggers/time/${item.metadata.name}`)
      .then(checkStatus)
      .then(parseJSON);
  }
  async postTriggerTimer(item) {
    return axios
      .post(`${this.basePath}triggers/time`, item)
      .then(checkStatus)
      .then(parseJSON);
  }
  async getTriggersMQ() {
    return axios
      .get(`${this.basePath}triggers/messagequeue`)
      .then(checkStatus)
      .then(parseJSON);
  }
  async removeTriggerMQ(item) {
    return axios
      .delete(`${this.basePath}triggers/messagequeue/${item.metadata.name}`)
      .then(checkStatus)
      .then(parseJSON);
  }
  async postTriggerMQ(item) {
    return axios
      .post(`${this.basePath}triggers/messagequeue`, item)
      .then(checkStatus)
      .then(parseJSON);
  }
}
