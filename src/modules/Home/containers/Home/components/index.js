import React, { useState, useEffect, useRef } from "react";

// tools
import {
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  FlatList,
  BackHandler,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
//import { Button } from "../../../../Auth/containers/Login/components/"
import Button from "components/Button";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useNavigationState } from "@react-navigation/native";

// comp
import Item from "../../../components/item";
// actions
import { listFormations, listRequestSuccess } from "../../../actions";

// styles & icons
import styles from "./styles";

// labels
import strings from "modules/Home/locales/fr";
// navigation
// ...
// import { Actions } from "react-native-router-flux";
import WonderPush from "react-native-wonderpush";
import { loginFailure, loginSuccess, setCurrentUser } from "modules/Auth/actions";
import { setUserHasSentNotificationsPermission } from "actions/notificationsPermissionsActions";
import { Api } from "api";
import { refreshToken } from "actions";
import { setUserAdherentCard } from "actions/adherentCardActions";
import { loginUrl } from "modules/Auth/api/endpoints";
import gaSendLoadAppEvent, { loadAppAlreadyCalled } from "services/ga-api";
import { navigate } from "router/navigator";

export default (props) => {
  // Execute methode on loading the page
  const dispatch = useDispatch();

  // State of filter : visibility & design
  const [visible, setVisible] = useState(false);
  const [bgc, setBgc] = useState({
    backgroundColor: "#FFF",
    opacity: 1,
  });

  // State of filter : selection
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [periodSelected, setPeriodSelected] = useState("");

  const adherentCard = useSelector((state) => state.adherentCard);

  const state = useSelector((state) => state.list);
  const currentUser = useSelector(
    (state) => state.global.currentUser
  );
  const profile = useSelector(
    (state) => state.global.currentUser?.contact?.avatar
  );
  const profileText = useSelector(
    (state) => state.global.currentUser?.contact?.lastname?.substr(0, 2)
  );

  // State of refresh
  const [refresh, setRefresh] = useState(false);

  // State from where start read the list
  const [initialScrollIndex, setInitialScrollIndex] = useState(0);

  // Modal filtre visible
  const [selection, setSelection] = useState(strings.recent);

  // Queries params
  const [queries, setQueries] = useState({
    sort: "createdAt",
    order: "desc",
  });

  // First print => Track GA Login EVENTS
  useEffect(() => {
    if (!loadAppAlreadyCalled) {
      gaSendLoadAppEvent(currentUser?.id?.toString(), "load_app");
    }
  }, []);

  // Get adherent card
  useEffect(() => {
    if (adherentCard?.lastname == "") {
      getWalletData();
    }
  }, []);

  const getWalletData = async () => {
    Api()
      .get('/wallet/information')
      .then((data) => {

        dispatch(setUserAdherentCard(data?.response));
      })
      .catch(async (error) => {

        if (error?.status_code != undefined && error?.status_code != null && error?.status_code == 401) {
          await refreshToken();
          getWalletData();
        }
        else {
          console.debug(JSON.stringify(error));
        }
      });
  }

  // on load of page set the initialScrollIndex
  useEffect(() => {
    props._id &&
      state?.list.map((item, index) => {
        if (item.id === props._id) {
          setInitialScrollIndex(index);
          return;
        }
      });
  }, []);

  // Surcharge du back handler
  useEffect(() => {

    if (Platform.OS === "ios") {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // backhandler function
  const backAction = () => {
    setVisible(false);
    setModalFilterVisible(false);
    BackHandler.exitApp();
    return true;
  };

  const selectPeriod = (period) => {
    setPeriodSelected(period)
    setModalFilterVisible(false)
  }

  const Filter = () => {
    if (modalFilterVisible)
      return (
        <TouchableOpacity
          onPress={() => setModalFilterVisible(false)}
          activeOpacity={1}
          style={styles.triContent}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalFilter}>
              <View style={styles.row}>
                <Text style={styles.modalFilterTitle}>{"Filtrer sur les articles sur la période"}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalFilterVisible(false);
                  }}
                >
                  <Image
                    style={styles.row_image}
                    source={require("assets/imgs/x.png")}
                  />
                </TouchableOpacity>
              </View>
              <View
              >
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => selectPeriod("3m")}
                >

                  <Text style={periodSelected === "3m" ? styles.selected : styles.unselected}>{"3 mois"}</Text>
                  {
                    periodSelected === "3m" && (
                      <Image
                        source={require("assets/imgs/check.png")}
                        style={styles.check}
                      />
                    )
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => selectPeriod("6m")}
                >

                  <Text style={periodSelected === "6m" ? styles.selected : styles.unselected}>{"6 mois"}</Text>
                  {
                    periodSelected === "6m" && (
                      <Image
                        source={require("assets/imgs/check.png")}
                        style={styles.check}
                      />
                    )
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => selectPeriod("12m")}
                >

                  <Text style={periodSelected === "12m" ? styles.selected : styles.unselected}>{"12 mois"}</Text>
                  {
                    periodSelected === "12m" && (
                      <Image
                        source={require("assets/imgs/check.png")}
                        style={styles.check}
                      />
                    )
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => selectPeriod("all")}
                >

                  <Text style={periodSelected === "all" ? styles.selected : styles.unselected}>{"Tous les articles"}</Text>
                  {
                    periodSelected === "all" && (
                      <Image
                        source={require("assets/imgs/check.png")}
                        style={styles.check}
                      />
                    )
                  }
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      )
  }

  // Filter menu
  const Tri = () => {
    if (visible)
      return (
        <TouchableOpacity
          onPress={() => setVisible(false)}
          activeOpacity={1}
          style={styles.triContent}
        >
          <TouchableWithoutFeedback>
            <View style={styles.tri}>
              <View style={styles.row}>
                <Text style={styles.row_title}>{strings.tri_title}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                    // setSelection([]);
                  }}
                >
                  <Image
                    style={styles.row_image}
                    source={require("assets/imgs/x.png")}
                  />
                </TouchableOpacity>
              </View>
              <View>
                {selection === strings.recent ? (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                      setSelection(strings.old);
                      setQueries({ sort: "createdAt", order: "asc" });
                      setVisible(false);
                    }}
                  >
                    <Text style={styles.selected}>{strings.recent}</Text>
                    <Image
                      source={require("assets/imgs/check.png")}
                      style={styles.check}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                      setSelection(strings.recent);
                      setQueries({ sort: "createdAt", order: "desc" });
                      setVisible(false);
                    }}
                  >
                    <Text style={styles.unselected}>{strings.recent}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                {selection === strings.old ? (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                      setSelection(strings.recent);
                      setQueries({ sort: "createdAt", order: "desc" });
                      setVisible(false);
                    }}
                  >
                    <Text style={styles.selected}>{strings.old}</Text>
                    <Image
                      source={require("assets/imgs/check.png")}
                      style={styles.check}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                      setSelection(strings.old);
                      setQueries({ sort: "createdAt", order: "asc" });
                      setVisible(false);
                    }}
                  >
                    <Text style={styles.unselected}>{strings.old}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                {selection === strings.featured ? (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                      setSelection(ref.current);
                      setQueries({ ...queries, sort: "createdAt" });
                      setVisible(false);
                    }}
                  >
                    <Text style={styles.selected}>{strings.featured}</Text>
                    <Image
                      source={require("assets/imgs/check.png")}
                      style={styles.check}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                      // setSelection(strings.visited);
                      // setQueries({ ...queries, sort: "featured" });
                      // setVisible(false);
                      if (state?.list?.length > 0) {
                        setSelection(strings.featured);
                        setQueries({ ...queries, sort: "featured" });
                        setVisible(false);
                      }
                      else {
                        setSelection(strings.recent);
                        setQueries({ sort: "createdAt", order: "desc" });
                        setVisible(false);
                      }
                    }}
                  >
                    <Text style={styles.unselected}>{strings.featured}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                {selection === strings.visited ? (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                      setSelection(ref.current);
                      setQueries({ ...queries, sort: "createdAt" });
                      setVisible(false);
                    }}
                  >
                    <Text style={styles.selected}>{strings.visited}</Text>
                    <Image
                      source={require("assets/imgs/check.png")}
                      style={styles.check}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                      setSelection(strings.visited);
                      setQueries({ ...queries, sort: "popular" });
                      setVisible(false);
                    }}
                  >
                    <Text style={styles.unselected}>{strings.visited}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      );
  };

  const ref = useRef(selection);

  // Refrech the render list
  const onRefresh = () => {
    dispatch(listFormations(20, 0, queries.sort, queries.order));
  };

  // Get more from server
  const getMore = () => {
    if (state?.list?.length <= state?.count) {
      dispatch(
        listFormations(20, state?.list?.length, queries.sort, queries.order)
      );
    }
  };

  // Resend request on change of tri params
  useEffect(() => {
    if (queries.sort != 'featured') {
      onRefresh();
    }
  }, [queries]);

  // Retourne le milliseconde à partir d'un nombre de mois
  const filterMonth = (month) => {
    return 1000 * 60 * 60 * 24 * 30 * month
  }

  const displayArticles = () => {
    if (queries.sort != "featured") {
      switch (periodSelected) {
        case "3m": return state?.list?.filter(article => article.createdAt > (Date.now() - filterMonth(3)))
        case "6m": return state?.list?.filter(article => article.createdAt > (Date.now() - filterMonth(6)))
        case "12m": return state?.list?.filter(article => article.createdAt > (Date.now() - filterMonth(12)))
        case "all": return state?.list
        default: return state?.list?.slice(0, 10)
      }
    }
    else {
      let finalNews = [];
      state?.list.map((item, index) => {
        if (item.featured) {
          finalNews.push(item);
        }
      });

      return finalNews
    }
  }

  // emptyList render
  function emptyList() {
    return (
      <View style={styles.errorContent}>
        <Text style={styles.errorMessage}>
          {
            periodSelected === "" ? "En cours de chargement..." : "Aucun article trouvé"
          }
        </Text>
      </View>
    );
  }
  return (
    <>

      {/* MAIN VIEW CONTAINER */}
      <View style={styles.container}>

        {/* TOPBAR CONTAINER */}
        <View style={styles.topBarContainer}>

          {/* TOPBAR LEFT ITEM */}
          <View style={[styles.topBarLeftItem]}>
            <View style={[styles.overlayiOS]}>
              <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => {
                // ...
                // Actions.Profile()
                navigate('Profile');
              }}>
                {profile ? (<Image source={{ uri: profile }} resizeMode="cover" style={[styles.profile]} />) : (<Text style={styles.profileText}>{profileText}</Text>)}
              </TouchableOpacity>
            </View >
          </View>

          {/* TOPBAR CENTER ITEM */}
          <View style={styles.topBarCenterItem}>
            <Image style={styles.logo} resizeMode="contain" source={require("assets/imgs/SNPI-logo-transparent.png")} />
          </View>

          {/* TOPBAR RIGHT ITEM */}
          <View style={styles.topBarRightItem}>
            <TouchableOpacity onPress={() => { setVisible(true) }}>
              <Image style={styles.picto} resizeMode="contain" source={require("assets/imgs/filter.png")} />
            </TouchableOpacity>
          </View>

        </View>

        {/* Remove the ScrollView wrapper */}
        <FlatList
          style={styles.list}
          data={displayArticles()}
          renderItem={({ item }) => <Item data={item} />}
          keyExtractor={(item) => item?.id?.toString()}
          extraData={state?.list}
          onEndReachedThreshold={0.1}
          onEndReached={() => getMore()}
          onRefresh={() => onRefresh()}
          refreshing={refresh}
          initialScrollIndex={initialScrollIndex}
          onScrollToIndexFailed={(d) => {
            setInitialScrollIndex(d?.index);
          }}
          ListEmptyComponent={() => emptyList()}
          ListFooterComponent={() => (
            state?.list && (
              <View style={styles.viewButtonSeeMore}>
                <Button
                  big
                  content={"Voir plus"}
                  onPress={() => setModalFilterVisible(true)}
                />
              </View>
            )
          )}
        />
      </View>
      {Tri()}
      {Filter()}
    </>
  );
};
