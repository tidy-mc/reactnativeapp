import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, Platform, Linking } from "react-native";
// ...
// import { Actions } from "react-native-router-flux";
import WonderPush from "react-native-wonderpush";

// styls
import styles from "./styles";
// strings
import strings from "locales/fr";
// lib
import { Switch } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Feather";
// actions
import { follower, followerSuccess, notificationsSuccess } from "modules/Profile/actions";
import LinearGradient from "react-native-linear-gradient";
import { setFollower, userNotification } from "api";
import { refreshToken, setCurrentUser } from "actions";
import { Api } from "api";
import { setUserAdherentCard } from "actions/adherentCardActions";
import { useNavigation } from "@react-navigation/native";

export default () => {

  const [isNewsCategoriesLoaded, setIsNewscategoriesLoaded] = useState(false);

  //const [cardLogoSrc, setcardLogoSrc] = useState(isExpert ? require("assets/imgs/logo-snpi-experts.png") : isCommercialAgent ? require("assets/imgs/logo-snpi-caci.png") : require("assets/imgs/logo-snpi-syndic.png"));
  const [walletLogo, setwalletLogo] = useState(Platform.OS == "android" ? require("assets/imgs/google-wallet-logo.png") : require("assets/imgs/apple-wallet-logo.png"));
  const [cardLogoSrc, setcardLogoSrc] = useState(require("assets/imgs/logo-snpi-syndic.png"));
  const [cardLogoCaciTopSrc, setcardLogoCaciTopSrc] = useState(require("assets/imgs/adherent_card_caci_top.png"));
  const [cardLogoCaciBottomSrc, setcardLogoCaciBottomSrc] = useState(require("assets/imgs/adherent_card_caci_bottom.png"));
  const [cardLogoExpertBgSrc, setcardLogoExpertBgSrc] = useState(require("assets/imgs/adherent_card_expert_bg.png"));

  const [memberYear, setMemberYear] = useState("");
  const [currentYear, setCurrentYear] = useState("");

  const [walletLink, setWalletLink] = useState("");

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const [isEnabled, setIsEnabled] = useState(false);

  const [bgc, setBgc] = useState({
    backgroundColor: "#FFF",
    opacity: 1,
  });

  // Execute action methodes
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // read from store
  const adherentCard = useSelector((state) => state.adherentCard);
  // MOCKED DATA
  // const adherentCard = {
  //   current_year_membership: "01/01/2022",
  //   card_type: "expert",
  //   firstname: "John",
  //   lastname: "Doe",
  //   company_name: "Example Company",
  //   member_id: "12345",
  // };
  const news = useSelector((state) => state.profile.news);
  const currentUser = useSelector((state) => state?.global?.currentUser?.contact);
  const currentUserCompany = useSelector((state) => state?.global?.currentUser?.company?.brand ?? "");

  // State of  selection
  const [selection, setSelection] = useState([]);
  const [state, setstate] = useState();

  // onLoad of component
  useEffect(() => {
    if (adherentCard?.current_year_membership != undefined && adherentCard?.current_year_membership != null) {

      let dateString = adherentCard.current_year_membership;
      let dateParts = dateString.split("/"); // Divise la chaîne de caractères en jour, mois et année
      let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

      let year = date.getFullYear().toString(); // Récupère l'année

      setCurrentYear(year);
    }
  }, []);

  useEffect(() => {
    let timestamp = adherentCard?.member_since;
    if (timestamp != undefined && timestamp != null && timestamp != "") {

      if (Platform.OS == "android") {
        if (typeof timestamp === 'string') {
          timestamp = Number(timestamp);
        }

        timestamp = timestamp * 1000;
        let date = new Date(timestamp);

        // Force localisation FR
        let localisedDate = date.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

        let year = localisedDate.substring(localisedDate.length - 4);
        setMemberYear(year);
      }
      else {
        let date;
        if (typeof timestamp === 'number') {
          timestamp = timestamp * 1000;
          date = new Date(timestamp);
        } else if (typeof timestamp === 'string') {
          timestamp = Number(timestamp);
          timestamp = timestamp * 1000;
          date = new Date(timestamp);
        }

        let year = date.getFullYear().toString();

        setMemberYear(year);
      }
    }
  }, []);

  // onLoad of component
  useEffect(() => {
    getWalletLink();
  }, []);

  const getWalletLink = async () => {
    Api()
      .get('/wallet/getlink/app')
      .then((data) => {
        if (data?.response?.link != undefined && data?.response?.link != null) {
          setWalletLink(data?.response?.link);
        }
      })
      .catch(async (error) => {

        if (error?.status_code != undefined && error?.status_code != null && error?.status_code == 401) {
          await refreshToken();
          getWalletLink();
        }
        else {
          console.debug(JSON.stringify(error));
        }
      });
  }

  // onLoad of component : MANAGE LOGO
  useEffect(() => {
    if (adherentCard?.card_type != null && adherentCard?.card_type != undefined) {
      if (adherentCard?.card_type == "expert") {
        setcardLogoSrc(require("assets/imgs/logo-snpi-experts.png"));
      }
      else if (adherentCard?.card_type == "caci") {
        setcardLogoSrc(require("assets/imgs/logo-snpi-caci.png"));
      }
    }
  }, [state]);

  // onLoad of component
  useEffect(() => {
    if (!isNewsCategoriesLoaded && !news?.categories != undefined && news?.categories != null && news?.categories.length > 0) {
      setIsNewscategoriesLoaded(true);
    }
  }, [news]);

  // onLoad of component
  useEffect(() => {
    dispatch(follower());
  }, []);

  useEffect(() => {

    if (isNewsCategoriesLoaded) {
      reSynchronizeUserTags().then(() => {
        // GO INIT
        initUserNotificationConfig();
      });
    }
  }, [isNewsCategoriesLoaded]);

  // Get all categories and clean not existing anymore categories + fire init
  const reSynchronizeUserTags = async () => {

    // 2. Loop on user tags
    const tags = await WonderPush.getTags();
    if (news?.categories != undefined && news?.categories != null && news?.categories.length > 0) {

      for (let tag of tags) {

        // Clean non existing anymore tags : check if categories existing -> else remove tags
        if (!news?.categories.some(item => item.slug.includes(tag))) {
          await WonderPush.removeTag(tag);
        }

      }

    }

  }

  const initUserNotificationConfig = async () => {

    // Get users current tags
    const tags = await WonderPush.getTags();

    // ALL TAGS SELECTED
    let followTypesLength = (news?.categories != undefined && news?.categories != null && news?.categories.length > 0) ? news?.categories.length : 0;
    if (tags.length >= followTypesLength) {
      setIsEnabled(true);
    }
    // NOT ALL TAGS SELECTED
    else {
      setIsEnabled(false);
    }

    setUserTags();

  };


  const setUserTags = async () => {
    let finalSelection = [];
    const tags = await WonderPush.getTags();
    setSelection([]);
    for (let tag of tags) {
      finalSelection.push(tag);
    }
    setSelection(finalSelection);

  }
  // Background & add items & wonderPush event on all click
  useEffect(() => {
    if (isEnabled) {
      setBgc({ backgroundColor: "#f9fafb", opacity: 0.5 });
    } else {
      setBgc({
        backgroundColor: "#FFF",
        opacity: 1,
      });
    }
  }, [isEnabled]);

  // Toggle selection
  useEffect(() => {
    let index = selection.indexOf(state);
    if (index > -1) {
      selection.splice(index, 1);
      setstate("");
    }
  }, [state]);

  // Select item
  const toggleSwitch = () => {

    if (isEnabled) {
      setIsEnabled(false);
    }
    else {

      let finalSelection = [];
      setSelection(finalSelection);

      if (isNewsCategoriesLoaded) {
        news?.categories.map(async (elm) => {

          if (elm?.slug != undefined && elm?.slug != null) {
            finalSelection.push(elm.slug);
            setSelection(finalSelection);

            await WonderPush.addTag(elm?.slug);
          }

        });
      }

      // SELECT ALL TYPES
      setIsEnabled(true);

    }

  }

  const selectItem = (item) => {
    let index = selection.indexOf(item);
    if (index > -1) {
      selection.splice(index, 1);
      setstate(item);
    } else {
      setSelection([...selection, item]);
    }
  };

  // Items render
  const render = (item) => {
    return selection.indexOf(item.slug) === -1 ? (
      <TouchableOpacity
        style={styles.choiceContent}
        onPress={async () => {
          selectItem(item.slug);
          // Add tag
          await WonderPush.addTag(item.slug);
        }}
      >
        <Text style={styles.items}>{item.title}</Text>
        <View style={styles.unselected}></View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={styles.choiceContent}
        onPress={async () => {
          if (!isEnabled) {
            selectItem(item.slug);
            // Remove tag
            await WonderPush.removeTag(item.slug);
          } else null;
        }}
      >
        <Text style={styles.items}>{item.title}</Text>
        <View style={styles.selected}>
          <Icon name="check" size={20} color="#b0bdd3" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View styles={styles.container}>

      {adherentCard?.card_type == "expert" && <Image
        style={{
          position: 'absolute',
          top: "-4%",
          width: screenWidth,
          height: screenHeight,
        }}
        resizeMode="contain"
        source={cardLogoExpertBgSrc}
      />}

      <View style={styles.hedaerContent}>
        <TouchableOpacity style={styles.backContent} activeOpacity={0.8} onPress={() => {
          // ...
          // Actions.pop()
          navigation.goBack();
        }}>
          <Image source={require("assets/imgs/arrow-back.png")} style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.title}>{strings.subscriptionsCard}</Text>
      </View>



      <View style={{
        height: screenHeight,
        marginTop: "4%",
        width: screenWidth,
        //backgroundColor: 'red'
      }}>

        <View style={{
          flex: 8,
          zIndex: 999,
          //backgroundColor: 'blue'
        }}>
          {adherentCard?.card_type == "caci" && <Image
            style={{
              alignSelf: 'center',
              top: "-4%",
              position: 'absolute',
              width: screenWidth / 3,
            }}
            resizeMode="contain"
            source={cardLogoCaciTopSrc}
          />}

          <View style={{
            flex: 1,
            margin: "10%",
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'rgb(144,169,213)',
            //backgroundColor: 'yellow'
          }}>

            <LinearGradient
              colors={['rgb(198, 208, 229)', 'rgb(214, 220, 229)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                borderRadius: 20, padding: "5%"
              }}
            >

              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // borderBottomColor: 'rgba(97,129,191,1)',
                // borderBottomWidth: 2,
                // paddingTop: "2%",      // Ajouter une marge supérieure
                // width: "80%",          // Ajuster la largeur de la bordure
                // padding: "2%",
                //backgroundColor: 'blue'
              }}>
                <Image
                  style={{
                    marginTop: "10%",
                    width: '110%',
                    height: '110%',
                  }}
                  resizeMode="contain"
                  source={cardLogoSrc}
                />

              </View>

              <View style={{
                marginTop: "15%",
                marginBottom: "5%",
                height: 2,
                backgroundColor: 'rgba(97,129,191,1)',
                marginHorizontal: "10%",
              }} />

              <View style={{
                flex: 1,
                marginTop: "10%",
                marginBottom: "10%",
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: "2%",
              }}>
                <View style={{
                  marginRight: "-4%",
                  transform: [{ rotate: '-90deg' }]
                }}>
                  <Text numberOfLines={1} style={{
                    color: "rgb(14,52,134)",
                    fontSize: 38,
                    fontFamily: "Poppins-ExtraLight",
                    textAlign: "center",
                  }}>{currentYear}</Text>
                </View>
                <View style={{
                  flex: 3,
                  height: "175%",
                }}>
                  <Text numberOfLines={1} style={{
                    fontSize: 18,
                    color: "rgb(14,52,134)",
                    fontFamily: "Poppins-Bold",
                  }}>{adherentCard?.firstname ?? ""}</Text>
                  <Text numberOfLines={2} style={{
                    marginTop: "-2%",
                    fontSize: 18,
                    color: "rgb(14,52,134)",
                    fontFamily: "Poppins-Bold",
                  }}>{adherentCard?.lastname ?? ""}</Text>
                  {adherentCard?.company_name != "" && <Text numberOfLines={1} style={{
                    marginTop: "2%",
                    fontSize: 14,
                    color: "rgb(14,52,134)",
                    fontFamily: "Poppins-Bold",
                  }}>{adherentCard?.company_name ?? ""}</Text>}
                  {adherentCard?.member_id && <Text style={{
                    marginTop: "6%",
                    color: "rgb(14,52,134)",
                    fontSize: 11,
                    fontFamily: "Poppins-Light",
                  }}>{"Numéro adhérent :" ?? ""}</Text>}
                  <Text style={{
                    fontSize: 11,
                    color: "rgb(14,52,134)",
                    fontFamily: "Poppins-Light",
                  }}>{adherentCard?.member_id ?? ""}</Text>
                </View>
              </View>

              {/*<View style={{*/}
              {/*  height: 2,*/}
              {/*  backgroundColor: 'rgba(97,129,191,1)',*/}
              {/*  marginHorizontal: "10%",*/}
              {/*}}/>*/}
              {memberYear != "" && memberYear != "NaN" && <View style={{
                height: 2,
                backgroundColor: 'rgba(97,129,191,1)',
                marginTop: "15%",
                marginHorizontal: "10%",
              }} />}
              <View style={{
                flex: 1,
                marginTop: "8%",
                alignItems: 'center',
                padding: "2%",
                //backgroundColor: 'yellow'
              }}>
                {memberYear != "" && memberYear != "NaN" && <Text style={{
                  fontSize: 14,
                  color: "rgb(14,52,134)",
                  fontFamily: "Poppins-Bold",
                }}>Adhérent depuis {memberYear}</Text>}
              </View>

            </LinearGradient>

          </View>

        </View>
        {adherentCard?.card_type == "caci" && <Image
          style={{
            alignSelf: 'center',
            zIndex: 1,
            bottom: "25%",
            position: 'absolute',
            width: screenWidth / 3,
          }}
          resizeMode="contain"
          source={cardLogoCaciBottomSrc}
        />}
        <View style={{
          flex: 3,
          //backgroundColor: 'green'
        }}>

          {walletLink != "" && <TouchableOpacity style={{
            alignItems: 'center',
          }} onPress={() => {
            Linking.openURL(walletLink);
          }}>
            <Image
              style={{
                width: '45%',
                height: '45%',
              }}
              resizeMode="contain"
              source={walletLogo}
            />
          </TouchableOpacity>}

          {/*<TouchableOpacity  style={{*/}
          {/*  alignItems : 'center',*/}
          {/*  display: 'flex',*/}
          {/*  flexDirection: 'row',*/}
          {/*  justifyContent : 'center',*/}
          {/*}} onPress={() => Actions.pop()}>*/}

          {/*  <Image*/}
          {/*      source={require('assets/imgs/close.png')}*/}
          {/*      style={styles.closeButton}*/}
          {/*  />*/}
          {/*  <Text style={styles.subtitle}>Fermer</Text>*/}

          {/*</TouchableOpacity>*/}

        </View>

      </View>

    </View>
  );
};
