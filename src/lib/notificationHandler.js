/**
 * Copyright (c) Flexi Apps.
 *
 * Notifications handler
 *
 */

import { navigate } from "router/navigator";


// Interactions toast
// import {displayToast} from 'lib/interactions';

// strings config
// import strings from 'config/strings';

// some actions to dispatch

export default ({ additionalData, isAppInFocus }, dispatch, getState) => {
  try {
    switch (additionalData.notif_type) {
      case 'new_pain':
        // ...
        // Actions._History();
        break;
      case 'new_message':
        // ...
        // getState().global.currentUser
        //   ? getState().global.currentUser.roles[0] === 'doctor'
        //     ? Actions.reset('drawer')
        //     : getState().global.conversationUser
        //     ? Actions.Chat({
        //         canal: getState().global.conversationUser._id,
        //         headerName:
        //           getState().global.conversationUser.users !== null
        //             ? getState().global.conversationUser.users[0].user.name
        //             : '',
        //       })
        //     : Actions.reset('Login')
        //   : Actions.reset('Login');
        break;
      default:
        break;
    }
  } catch { }
};
