import React from "react";

import FollowersComponents from "./components";

// Injectors
import injectLocales from "utils/injectLocales";


// import locales
import fr from "locales/fr";

//
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// redux action
import * as actions from "modules/Profile/actions";


const FollowersPage = (props) => {
  injectLocales({ fr });
  return <FollowersComponents {...props} />;
};
const mapStateToProps = ({ auth, global }) => ({
  auth,
  // oneSignalPlayerId: global.oneSignalPlayerId,
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowersPage);
