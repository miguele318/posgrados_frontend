import { bool } from 'prop-types';
import http from './ApiConfig';
import studentData from './local_data/students-info.json';
import activitiesData from './local_data/student_activities.json';

const getStudentActivities = () => {
  return http.get('/student_activities');
};

const getStudentActivitiesLocal = () => {
  return activitiesData;
};

const getStudentsInfo = () => {
  return http.get('/students-info.json');
};

const getStudentsInfoLocal = () => {
  return studentData;
};

const getStudentsInfoDirectorLocal = directorID => {
  //TODO: GET STUDENTS OF A DIRECTOR
  return studentData;
};

const getStudent = id => {
  return studentData.find(student => student.id == id);
};

const getActivity = id => {
  return activitiesData.find(activity => activity.id == id);
};

export default {
  getStudentActivitiesLocal,
  getStudentActivities,
  getStudentsInfoLocal,
  getStudentsInfoDirectorLocal,
  getStudentsInfo,
  getStudent,
  getActivity
};
