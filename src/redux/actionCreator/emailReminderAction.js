import {
  DISABLE_REMINDER_CONDITION,
  DISABLE_REMINDER_CONDITION_SUCCESS,
  DISABLE_REMINDER_CONDITION_FAILURE,
  FETCH_EMAIL_REMINDERS,
  FETCH_EMAIL_REMINDERS_SUCCESS,
  FETCH_EMAIL_REMINDERS_FAILURE,
} from '../constants/actionTypes';

export const fetchEmailReminder = (query) => {
  return {
    type: FETCH_EMAIL_REMINDERS,
    query
  };

};

export const fetchEmailReminderSuccess = (data) => {
  return {
    type: FETCH_EMAIL_REMINDERS_SUCCESS,
    payload: data
  };
};

export const fetchEmailReminderFailure = (error) => {
  return {
    type: FETCH_EMAIL_REMINDERS_FAILURE,
    payload: error
  };
};

export const disableReminderCondition  = (conditionId, reason) => ({
  type: DISABLE_REMINDER_CONDITION,
  conditionId,
  reason,
});

export const disableReminderConditionSuccess = condition => ({
  type: DISABLE_REMINDER_CONDITION_SUCCESS,
  condition,
});

export const disableReminderConditionFailure = error => ({
  type: DISABLE_REMINDER_CONDITION_FAILURE,
  error,
});
