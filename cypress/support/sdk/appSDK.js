import request from 'request-promise-native';

class AppSDK {
  constructor(host, accessToken) {
    this.request = request.defaults({
      baseUrl: `https://${host}`,
      headers: {
        'Accept': 'application/vnd.api+json;revision=1',
        'Content-Type': 'application/vnd.api+json',
        'Cache-control': 'no-cache',
        'Authorization': `Bearer ${accessToken}`,
        'X-Api-Key': 'App-KEY'
      },
      json: true
    });
  }

  // Property
  //////////////////////////////////////////////////////////////////////////

  createProperty(companyId, property) {
    return this.request.post({
      url: `/companies/${companyId}/properties`,
      body: {
        data: property
      }
    });
  }

  retrieveProperty(propertyId) {
    return this.request.get({
      url: `/properties/${propertyId}`
    });
  }

  listProperties(companyId, options) {
    return this.request.get({
      url: `/companies/${companyId}/properties`,
      qs: options
    });
  }

  updateProperty(propertyId, property) {
    return this.request.patch({
      url: `/properties/${propertyId}`,
      body: {
        data: property
      }
    });
  }

  deleteProperty(propertyId) {
    return this.request.delete({
      url: `/properties/${propertyId}`
    });
  }

  // Host
  //////////////////////////////////////////////////////////////////////////

  createHost(propertyId, host) {
    return this.request.post({
      url: `/properties/${propertyId}/hosts`,
      body: {
        data: host
      }
    });
  }

  retrieveHost(hostId) {
    return this.request.get({
      url: `/hosts/${hostId}`
    });
  }

  listHosts(propertyId, options) {
    return this.request.get({
      url: `/properties/${propertyId}/hosts`,
      qs: options
    });
  }

  updateHost(hostId, host) {
    return this.request.patch({
      url: `/hosts/${hostId}`,
      body: {
        data: host
      }
    });
  }

  deleteHost(hostId) {
    return this.request.delete({
      url: `/hosts/${hostId}`
    });
  }

  // Environment
  //////////////////////////////////////////////////////////////////////////

  createEnvironment(propertyId, environment) {
    return this.request.post({
      url: `/properties/${propertyId}/environments`,
      body: {
        data: environment
      }
    });
  }

  retrieveEnvironment(environmentId) {
    return this.request.get({
      url: `/environments/${environmentId}`
    });
  }

  listEnvironments(propertyId, options) {
    return this.request.get({
      url: `/properties/${propertyId}/environments`,
      qs: options
    });
  }

  updateEnvironment(environmentId, environment) {
    return this.request.patch({
      url: `/environments/${environmentId}`,
      body: {
        data: environment
      }
    });
  }

  deleteEnvironment(environmentId) {
    return this.request.delete({
      url: `/environments/${environmentId}`
    });
  }
}

export default AppSDK;
