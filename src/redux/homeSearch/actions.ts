import NetworkOps, { FetchResponse } from '../../network/NetworkOps';
import Urls from '../../network/Urls';
import * as actionTypes from './constants';
import { setShowToast, setLoading } from '../common/actions';
// import storageService from '../../utils/storageService';


export const getSearchJobList = (searchJob: string) => ({ type: actionTypes.GET_SEARCH_JOB_LIST, searchJob })
export const getRecentSearchList = () => ({ type: actionTypes.GET_RECENT_SEARCH_LIST })
export const getJobTypeList = () => ({ type: actionTypes.GET_JOB_TYPE_LIST })
export const getViewNearByJob = (data: object) => ({ type: actionTypes.GET_VIEW_NEARBY_JOBS, data })
// export const getJobType = () => ({ type: actionTypes.GET_JOB_TYPE})
export const getJobWithJobTypeLatLong = (jobData: object) => ({ type: actionTypes.GET_JOB_WITH_JOB_TYPE_AND_LATLONG, jobData })
export const postHomeSearchData = (jobData: object) => ({ type: actionTypes.POST_HOME_SEARCH_DATA, jobData })

// export const getHomeJobDetails = (jobId: string) => ({ type: actionTypes.GET_HOME_JOB_DETAILS, jobId })
export const getHomeJobDetails = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.get(Urls.homeJobDetails + `?jobId=${data.jobId}&tradeId=${data.tradeId}&specializationId=${data.specializationId}`);
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, data: response.result };
    }
    setShowToast(true, response.message);
    return { success: false };
}

export const getHomeSaveJob = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.get(Urls.homeSaveJob + `?jobId=${data.jobId}&tradeId=${data.tradeId}&specializationId=${data.specializationId}&isSave=${data.isSave}`);
    setLoading(false);
    if (response.status_code === 200) {
        setShowToast(true, response.message);
        return { success: true };
    }
    setShowToast(true, response.message);
    return { success: false };
}

// export const postHomeApplyJob = (data: object) => ({ type: actionTypes.POST_HOME_APPLY_JOB, data })
export const postHomeApplyJob = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.postToJson(Urls.homeApplyJob, data)
    setLoading(false);
    if (response.status_code === 200) {
        setShowToast(true, response.message);
        return { success: true, data: response };
    }
    setShowToast(true, response.message);
    return { success: false };
}

export const deleteRecentSearch = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.putToJson(Urls.deleteRecentSearch, data)
    setLoading(false);
    if (response.status_code === 200) {
      setShowToast(true, response.message);
      return { success: true };
    }
    setShowToast(true, response.message);
    return { success: false };
  }
