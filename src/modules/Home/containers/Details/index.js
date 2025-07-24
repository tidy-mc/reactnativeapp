import React from "react";

import DetailsComponents from "./components";

// Injectors
import injectLocales from "utils/injectLocales";


// import locales
import fr from "locales/fr";

//
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// redux action
import * as actions from "modules/Auth/actions";

const DetailsPage = (props) => {
  injectLocales({ fr });
  return <DetailsComponents {...props} />;
};
const mapStateToProps = ({ auth, global }) => ({
  auth,
  // oneSignalPlayerId: global.oneSignalPlayerId,
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsPage);
