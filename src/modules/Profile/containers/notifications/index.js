import React from "react";

import Components from "./components";

// Injectors
import injectLocales from "utils/injectLocales";


// import locales
import fr from "locales/fr";

//
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// redux action
import * as actions from "modules/Profile/actions";


const Page = (props) => {
  injectLocales({ fr });
  return <Components {...props} />;
};
const mapStateToProps = ({ auth, global }) => ({
  auth,
  // oneSignalPlayerId: global.oneSignalPlayerId,
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Page);
