import axios from 'axios';

import { GET_ERRORS, GET_PROFILE, GET_PROFILES, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, SET_CURRENT_USER } from './types';

// Get all profiles
export const getProfiles = () => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get('/api/profile/all')
        .then(res => {
            if(res.data.errors) {
                dispatch({
                    type: GET_PROFILES,
                    payload: null
                });
            }   
            else {
                dispatch({
                    type: GET_PROFILES,
                    payload: res.data
                });
            } 
        })
        .catch(err =>
            dispatch({
                type: GET_PROFILES,
                payload: null
            })
        );
};

// Get current profile
export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get('/api/profile')
        .then(res => {
            if(res.data.errors) {
                dispatch({
                    type: GET_PROFILE,
                    payload: {}
                })
            }
            else {
                dispatch({
                    type: GET_PROFILE,
                    payload: res.data
                });
            }
        })
        .catch(err => {
            dispatch({
                type: GET_PROFILE,
                payload: {}
            })
        })
}

// Get profile by handle
export const getProfileByHandle = handle => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get(`/api/profile/handle/${handle}`)
        .then(res => {
            if(res.data.errors) {
                dispatch({
                    type: GET_PROFILE,
                    payload: {}
                });
            }
            else {
                dispatch({
                    type: GET_PROFILE,
                    payload: res.data.profile
                });
            }
        })
        .catch(err =>
            dispatch({
                type: GET_PROFILE,
                payload: {}
            })
        );
};

// Create Profile
export const createProfile = (profile, history) => dispatch => {
    axios.post('/api/profile', profile)
        .then(res => {
            if(res.data.errors) {
                dispatch({
                    type: GET_ERRORS,
                    payload: res.data.errors
                })
            }
            else {
                history.push('/dashboard')
            }
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        });
}

// Add Education
export const addEducation = (eduData, history) => dispatch => {
    axios.post('/api/profile/education', eduData)
        .then(res => {
            if(res.data.errors) {
                dispatch({
                    type: GET_ERRORS,
                    payload: res.data.errors
                })
            }
            else {
                history.push('/dashboard');
            }
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

// Add Experience
export const addExperience = (expData, history) => dispatch => {
    axios.post('/api/profile/experience', expData)
        .then(res => {
            if(res.data.errors) {
                dispatch({
                    type: GET_ERRORS,
                    payload: res.data.errors
                })
            }
            else {
                history.push('/dashboard');
            }
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

// Delete Education
export const deleteEducation = (id) => dispatch => {
    axios.delete(`/api/profile/education/${id}`)
        .then(res => {
            if(res.data.errors) {
                dispatch({
                    type: GET_ERRORS,
                    payload: res.data.errors
                })
            } else {
                dispatch({
                    type: GET_PROFILE,
                    payload: res.data
                })
            }
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

// Delete Experience
export const deleteExperience = (id) => dispatch => {
    axios.delete(`/api/profile/experience/${id}`)
        .then(res => {
            if(res.data.errors) {
                dispatch({
                    type: GET_ERRORS,
                    payload: res.data.errors
                })
            } else {
                dispatch({
                    type: GET_PROFILE,
                    payload: res.data
                })
            }
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

// Delete account & profile
export const deleteAccount = () => dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      axios
        .delete('/api/profile')
        .then(res => {
            if(res.data.errors) {
                dispatch({
                    type: GET_ERRORS,
                    payload: res.data.errors
                })
            } else {
                dispatch({
                    type: SET_CURRENT_USER,
                    payload: {}
                })
            }
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
    }
};

// Profile loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
}

export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
}