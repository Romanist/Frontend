export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';


export const showNotification = (notificationType='info', notificationID = null, message='', url='') => {
  return dispatch => {
    const viewedNotificationIDs = localStorage['viewedNotification'] ?
      JSON.parse(localStorage.getItem('viewedNotification')) : [];
    const isCurrentNotificationWasViewed = viewedNotificationIDs.find(currentNotificationID =>{
      return currentNotificationID.toString() === notificationID.toString(); }
    );
    if (!isCurrentNotificationWasViewed) {
      dispatch({
        type: SHOW_NOTIFICATION,
        notificationType,
        notificationID,
        message,
        url
      });
      localStorage.setItem('viewedNotification', JSON.stringify([notificationID, ...viewedNotificationIDs]));
    } 
  };
};

export const closeNotification = () => {
  return dispatch => {
    dispatch({
      type: CLOSE_NOTIFICATION,
    });
  };
};
