import React from "react";

import ListPageComponents from "./components";

// Injectors
import injectLocales from "utils/injectLocales";


// import locales
import fr from "locales/fr";

//
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// redux action
import * as actions from "modules/Auth/actions";


const ListPage = (props) => {
  injectLocales({ fr });
  return <ListPageComponents {...props} />;
};
const mapStateToProps = ({ auth, global }) => ({
  auth,
  // oneSignalPlayerId: global.oneSignalPlayerId,
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
