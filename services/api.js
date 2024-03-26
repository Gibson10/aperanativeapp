import request from '../utils/Request';
import {
  updateProfilePic,
  updateDriversLicense
} from '../utils/Request';

//User Routes
export function login(params) {
  return request('/auth/login', { method: 'POST', body: params });
}

export function register(params) {
  return request('/auth/register', { method: 'POST', body: params });
}

export function businessRegister(params) {
  return request('/auth/businessRegistration', { method: 'POST', body: params });
}

export function forgot(params) {
  return request('forgotPasswordOtp', {
    method: 'POST',
    body: params,
  });
}

export function changePassword(userId,params) {
  return request(`/profile/${userId}/changePassword`, { method: 'PUT', body: params });
}

export function validateAuthToken() {
  return request('api/protected/login', { method: 'GET' });
}

export function profilePut(params) {
  return request(`/profile`, {
    method: 'PUT',
    body: params,
  });
}
export function emailVerification(params) {
  return request('/user/email', { method: 'POST', body: params });
}
export function verification(params) {
  return request('/user/confirm', { method: 'POST', body: params });
}
export function getConfirmation(userId) {
  return request(`auth/confirmation/${userId}`, { method: 'GET' });
}

export function updateAccountDetails(userId,params) {
  return request(`profile/${userId}/cardDetails`, { method: 'PUT', body: params });
}

export function updateOperativeSkills(userId,params) {
  return request(`/profile/${userId}/operativeSkills`, { method: 'PUT', body: params });
}

export function phoneNumberVerification(params) {
  console.log('params', params);
  return request('/auth/phoneNumber/confirm', { method: 'POST', body: params });
}
export function confirmUser(params) {
  return request('/auth/confirm', { method: 'POST', body: params });
}
export function updateMobilePaymentStatus(userId,params) {
  return request(`/profile/${userId}/mobilePaymentProvider`, { method: 'PUT', body: params });
}

export function updateNotificationStatus(userId,params) {
  return request(`/profile/${userId}/notificationToken`, { method: 'PUT', body: params });
}


export function updateUserImage(userId,params) {
  return updateProfilePic(`/profile/${userId}/image`, { method: 'PUT', body: params });
}
export function updateBusiness(userId,params) {
  return request(`/profile/${userId}/businessDetails`, { method: 'PUT', body: params });
}


export function updateLicenceDetails(userId,params) {
  return updateDriversLicense(`/profile/${userId}/documents`, { method: 'PUT', body: params });
}


//Gigs
export function getGigs() {
  return request(`/gig`, { method: 'GET' });
}

export function getGig(id) {
  return request(`/gig/${id}`, { method: 'GET' });
}

export function updateGig(id,params) {
  return request(`/gig/${id}`, { method: 'PUT',body:params });
}
export function getUser(id) {
  return request(`/profile/${id}/user`, { method: 'GET' });
}
export function getMatchedGigs(userId,params) {
  return request(`/gig/${userId}/matched`, { method: 'POST',body:params, });
}

export function getBusinessGigs(userId) {
  return request(`/gig/${userId}/business`, { method: 'GET' });
}

export function getAllBusinessGigs(userId) {
  return request(`/gig/${userId}/business/all`, { method: 'GET' });
}


export function getOperativesGigs(userId) {
  return request(`/gig/${userId}/operative`, { method: 'GET' });
}

export function createGigs(params) {
  return request(`/createGig`, { method: 'POST', body: params });
}

export function updateGigStatus(id,params) {
  return request(`/gig/${id}/status`, { method: 'PUT', body: params });
}
export function updateGigStatusPaid(id,params) {
  return request(`/gig/${id}/payment`, { method: 'PUT', body: params });
}


export function acceptGig(userId,params) {
  return request(`/gig/${userId}/accept`, { method: 'PUT', body: params });
}

export function deleteGigById(id) {
  return request(`/gig/${id}/`, { method: 'DELETE' });
}

export function acceptApparator(id) {
  return request(`/gig/rejectedstatus/${id}`, { method: 'PUT', body: {} });
}



export function stripeAccount(params) {
  return request(`/stripeAccount`, { method: 'POST', body: params });
}


export function updateOnboarding(params,userId) {
  return request(`/profile/${userId}`, { method: 'POST', body: params });
}


export function createPaymentIntent(params) {
  return request(`/paymentIntent`, { method: 'POST',body:params});
}