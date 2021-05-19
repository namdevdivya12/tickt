import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from './constants';
import { MARK_MILESTONE_COMPLETE } from '../jobs/constants';
import NetworkOps, { FetchResponse } from '../../network/NetworkOps';
import Urls from '../../network/Urls';
import { setLoading, setShowToast } from '../common/actions';
import { markMilestoneComplete } from '../jobs/actions';

function* callTradieProfileData() {
  const response: FetchResponse = yield NetworkOps.get(Urls.profileTradie);
  if (response.status_code === 200) {
    yield put({
      type: actionTypes.SET_TRADIE_PROFILE_DATA,
      payload: response.result,
    });
  } else {
    yield put({ type: actionTypes.SET_TRADIE_PROFILE_DATA, payload: '' });
  }
}

function* addBankDetails({ data, milestoneData, callback }: any) {
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.postToJson(
    Urls.addBankDetails,
    data
  );
  setLoading(false);

  if (response.status_code === 200) {
    yield put({
      type: actionTypes.ADD_BANK_DETAILS_END,
      payload: response.result
    });

    yield put({ type: MARK_MILESTONE_COMPLETE, data: milestoneData, callback });

    return;
  }

  setShowToast(true, response.message);
  yield put({ type: actionTypes.ADD_BANK_DETAILS_END, payload: data });
}

function* updateBankDetails({ data, milestoneData, callback }: any) {
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.putToJson(
    Urls.updateBankDetails,
    data
  );
  setLoading(false);

  if (response.status_code === 200) {
    yield put({
      type: actionTypes.UPDATE_BANK_DETAILS_END,
      payload: response.result
    });

    yield put({ type: MARK_MILESTONE_COMPLETE, data: milestoneData, callback });

    return;
  }

  setShowToast(true, response.message);
  yield put({ type: actionTypes.UPDATE_BANK_DETAILS_END, payload: data });
}

function* getBankDetails() {
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.get(Urls.getBankDetails);
  setLoading(false);

  if (response.status_code === 200) {
    yield put({
      type: actionTypes.GET_BANK_DETAILS_END,
      payload: response.result
    });

    return;
  }

  setShowToast(true, response.message);
  yield put({ type: actionTypes.UPDATE_BANK_DETAILS_END, payload: {} });
}

function* authWatcher() {
  yield takeLatest(actionTypes.GET_TRADIE_PROFILE_DATA, callTradieProfileData);
  yield takeLatest(actionTypes.ADD_BANK_DETAILS_START, addBankDetails);
  yield takeLatest(actionTypes.UPDATE_BANK_DETAILS_START, updateBankDetails);
  yield takeLatest(actionTypes.GET_BANK_DETAILS_START, getBankDetails);
}

export default authWatcher;
