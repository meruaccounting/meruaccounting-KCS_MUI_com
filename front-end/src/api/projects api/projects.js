import {
  ADD_TEAM_PROJECTS_FAILED,
  ADD_TEAM_PROJECTS_SUCCESS,
  CREATE_PROJECTS_FAILED,
  CREATE_PROJECTS_SUCCESS,
  DELETE_PROJECTS_FAILED,
  DELETE_PROJECTS_SUCCESS,
  EDIT_PROJECTS_FAILED,
  EDIT_PROJECTS_SUCCESS,
  GET_PROJECT_BYID_SUCCESS,
  GET_PROJECT_BYID_FAILED,
  ADD_MEMBER_TOPROJECT_SUCCESS,
  ADD_MEMBER_TOPROJECT_FAILED,
  ADD_PROJECTLEADER_SUCCESS,
  ADD_PROJECTLEADER_FAILED,
  REMOVE_MEMBER_FROMRPOJECT_SUCCESS,
  REMOVE_MEMBER_FROMRPOJECT_FAILED,
} from "src/constants/ProjectConstants";
import axios from "axios";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage["Bearer Token"]}`,
  },
};

export const createProject = async (incomingData, dispatch) => {
  try {
    const res = await axios.post(`/project`, incomingData, config);

    dispatch({
      type: CREATE_PROJECTS_SUCCESS,
      payload: res.data,
    });
    return res;
  } catch (error) {
    dispatch({
      type: CREATE_PROJECTS_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

export const addTeamToProject = async (incomingData, dispatch) => {
  try {
    const res = await axios.patch(`/project`, incomingData, config);

    dispatch({ type: ADD_TEAM_PROJECTS_SUCCESS, payload: res.data });
    return res;
  } catch (error) {
    dispatch({
      type: ADD_TEAM_PROJECTS_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

export const editProject = async (_id, incomingData, dispatch) => {
  try {
    const res = await axios.patch(`/project/${_id}`, incomingData, config);

    dispatch({ type: EDIT_PROJECTS_SUCCESS, payload: res.data });
    return res;
  } catch (error) {
    dispatch({
      type: EDIT_PROJECTS_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

export const deleteProject = async (incomingData, dispatch) => {
  try {
    const res = await axios.delete(`/project`, {
      data: { projectId: `${incomingData}` },
      config,
    });

    dispatch({ type: DELETE_PROJECTS_SUCCESS, payload: res.data });
    return res;
  } catch (error) {
    dispatch({
      type: DELETE_PROJECTS_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

export const getProjectById = async (incomingData, dispatch) => {
  try {
    const res = await axios.get(`/project/${incomingData}`, config);
    dispatch({ type: GET_PROJECT_BYID_SUCCESS, payload: res.data });
    return res;
  } catch (error) {
    dispatch({
      type: GET_PROJECT_BYID_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

export const addProjectMember = async (incomingData, dispatch) => {
  try {
    const res = await axios.post(`/project/addMember/${incomingData[0]}`, {
      employeeId: incomingData[1],
    });

    dispatch({ type: ADD_MEMBER_TOPROJECT_SUCCESS, payload: res.data });
    return res;
  } catch (error) {
    dispatch({
      type: ADD_MEMBER_TOPROJECT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

export const addProjectLeader = async (incomingData, dispatch) => {
  try {
    const res = await axios.post(`/project/projectLeader/${incomingData[0]}`, {
      employeeMail: `${incomingData[1]}`,
    });
    dispatch({ type: ADD_PROJECTLEADER_SUCCESS, payload: res.data });
    return res;
  } catch (error) {
    dispatch({
      type: ADD_PROJECTLEADER_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};
export const removeProjectLeader = async (id, dispatch) => {
  try {
    const res = await axios.patch(`/project/projectLeader/${id}`);
    dispatch({ type: ADD_PROJECTLEADER_SUCCESS, payload: res.data });
    return res;
  } catch (error) {
    dispatch({
      type: ADD_PROJECTLEADER_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

export const removeProjectMem = async (incomingData, dispatch) => {
  try {
    const res = await axios.patch(`/project/removeMember/${incomingData[0]}`, {
      employeeId: incomingData[1],
    });
    dispatch({ type: REMOVE_MEMBER_FROMRPOJECT_SUCCESS, payload: res.data });
    return res;
  } catch (error) {
    dispatch({
      type: REMOVE_MEMBER_FROMRPOJECT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};
