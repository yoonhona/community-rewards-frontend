import axios from 'axios';

import _ from 'lodash';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
    CREATE_EVENT: 'event/CREATE_EVENT',
    GET_EVENTS: 'event/GET_EVENTS',
    GET_EVENT: 'event/GET_EVENT',
    GET_GROUP_PARTICIPATIONS: 'event/GET_GROUP_PARTICIPATIONS',
    GET_EVENT_PARTICIPATIONS: 'event/GET_EVENT_PARTICIPATIONS',
    GET_EVENT_PARTICIPATIONS_BY_USER: 'event/GET_EVENT_PARTICIPATIONS_BY_USER',
    GET_EVENT_REWARDS: 'event/GET_EVENT_REWARDS',
    GET_EVENT_REWARDS_BY_USER: 'event/GET_EVENT_REWARDS_BY_USER',
    GET_AGGS_PARTICIPATIONS: 'event/GET_AGGS_PARTICIPATIONS'
};

const initialState = {
    loading: false,
    events: {},
    event: {
        '_id': '1',
        'title': '',
        'description': '',
        'tokens': 0,
        'maxNumberOfParticipants': 0,
        'startDate': '',
        'finishDate': '',
        'isClosed': false,
        'createdAt': '2019/03/01 16:03:07',
        'createdBy': 'admin'
    },
    participations: [],
    groupParticipations: {},
    userParticipations: {},
    aggsParticipations: {},
    rewards: {},
    userRewards: {
        totalDocs: 0,
        docs: []
    },
    errorMessage: ''
};

export type EventState = Readonly<typeof initialState>;

// Reducer
export default (state: EventState = initialState, action): EventState => {
    switch (action.type) {
        case REQUEST(ACTION_TYPES.GET_EVENTS):
            return {
                ...state,
                loading: true
            };
        case FAILURE(ACTION_TYPES.GET_EVENTS):
            return {
                ...initialState,
                loading: false,
                errorMessage: action.payload
            };
        case SUCCESS(ACTION_TYPES.GET_EVENTS):
            return {
                ...state,
                loading: false,
                events: action.payload.data
            };
        case REQUEST(ACTION_TYPES.GET_EVENT):
            return {
                ...state,
                loading: true
            };
        case FAILURE(ACTION_TYPES.GET_EVENT):
            return {
                ...initialState,
                loading: false,
                errorMessage: action.payload
            };
        case SUCCESS(ACTION_TYPES.GET_EVENT):
            return {
                ...state,
                loading: false,
                event: action.payload.data
            };
        case SUCCESS(ACTION_TYPES.GET_GROUP_PARTICIPATIONS):
            return {
                ...state,
                loading: false,
                groupParticipations: action.payload.data
            };
        case REQUEST(ACTION_TYPES.GET_EVENT_PARTICIPATIONS):
            return {
                ...state,
                loading: true
            };
        case FAILURE(ACTION_TYPES.GET_EVENT_PARTICIPATIONS):
            return {
                ...initialState,
                loading: false,
                errorMessage: action.payload
            };
        case SUCCESS(ACTION_TYPES.GET_EVENT_PARTICIPATIONS):
            return {
                ...state,
                loading: false,
                participations: action.payload.data
            };
        case SUCCESS(ACTION_TYPES.GET_EVENT_PARTICIPATIONS_BY_USER):
            return {
                ...state,
                loading: false,
                userParticipations: action.payload.data
            };
        case SUCCESS(ACTION_TYPES.GET_EVENT_REWARDS):
            return {
                ...state,
                loading: false,
                rewards: action.payload.data
            };
        case SUCCESS(ACTION_TYPES.GET_EVENT_REWARDS_BY_USER):
            return {
                ...state,
                loading: false,
                userRewards: action.payload.data
            };
        case SUCCESS(ACTION_TYPES.GET_AGGS_PARTICIPATIONS):
            return {
                ...state,
                loading: false,
                aggsParticipations: action.payload.data
            };
        default:
            return state;
    }
};

export const createEvent = (groupId, event) => async dispatch => {
    // title, description, tokens, startDate, finishDate
    const result = await dispatch({
        type: ACTION_TYPES.CREATE_EVENT,
        payload: axios.post(`v1/groups/${groupId}/events`, event)
    });
    dispatch(getEvents(groupId));
    return result;
};

export const getEvents = groupId => ({
    type: ACTION_TYPES.GET_EVENTS,
    payload: axios.get(`v1/groups/${groupId}/events`)
});

// Actions
export const getEvent = (groupId, eventId) => ({
    type: ACTION_TYPES.GET_EVENT,
    payload: axios.get(`v1/groups/${groupId}/events/${eventId}`)
});

// v1/groups/:groupId/participations
export const getGroupParticipations = (groupId) => ({
    type: ACTION_TYPES.GET_GROUP_PARTICIPATIONS,
    payload: axios.get(`v1/groups/${groupId}/participations`)
});

// v1/groups/:groupId/events/:eventId/participations
export const getEventParticipations = (groupId, eventId) => ({
    type: ACTION_TYPES.GET_EVENT_PARTICIPATIONS,
    payload: axios.get(`v1/groups/${groupId}/events/${eventId}/participations`)
});

export const getEventParticipationByUser = (groupId, userId) => ({
    type: ACTION_TYPES.GET_EVENT_PARTICIPATIONS_BY_USER,
    payload: axios.get(`v1/groups/${groupId}/users/${userId}/participations`)
});

export const getEventRewards = (groupId, eventId) => ({
    type: ACTION_TYPES.GET_EVENT_REWARDS,
    payload: axios.get(`v1/groups/${groupId}/events/${eventId}/rewards`)
});

// GET /v1/groups/:groupId/users/:userId/rewards
export const getEventRewardsByUser = (groupId, userId) => ({
    type: ACTION_TYPES.GET_EVENT_REWARDS_BY_USER,
    payload: axios.get(`v1/groups/${groupId}/users/${userId}/rewards`)
});

// GET /v1/groups/:groupId/aggs/participations (optional: startDate, endDate, limit)
export const getAggsParticipations = (groupId, startDate?, endDate?, limit?) => {
    let requestUrl = `v1/groups/${groupId}/aggs/participations`;
    let params = '';
    if (!_.isEmpty(startDate)) params = params.concat(`&startDate=${startDate}`);
    if (!_.isEmpty(endDate)) params = params.concat(`&endDate=${endDate}`);
    if (!_.isEmpty(limit)) params = params.concat(`&limit=${limit}`);
    if (!_.isEmpty(params)) requestUrl = requestUrl.concat('?').concat(params);
    return {
        type: ACTION_TYPES.GET_AGGS_PARTICIPATIONS,
        payload: axios.get(requestUrl)
    };
};
