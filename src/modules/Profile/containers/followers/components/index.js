import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
// import { Actions } from "react-native-router-flux";
import WonderPush from "react-native-wonderpush";

// styls
import styles from "./styles";
// strings
import strings from "modules/Profile/locales/fr";
// lib
import { Switch } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Feather";
// actions
import { follower } from "modules/Profile/actions";
import { useNavigation } from "@react-navigation/native";

export default () => {

  const [isNewsCategoriesLoaded, setIsNewscategoriesLoaded] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);

  const [bgc, setBgc] = useState({
    backgroundColor: "#FFF",
    opacity: 1,
  });

  // Execute action methodes
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // read from store
  const news = useSelector((state) => state.profile.news);

  // State of  selection
  const [selection, setSelection] = useState([]);
  const [state, setstate] = useState();

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
      <View style={styles.hedaerContent}>
        <TouchableOpacity style={styles.backContent} activeOpacity={0.8} onPress={() => {
          // ...
          // Actions.pop()
          navigation.goBack();
        }}>
          <Image source={require("assets/imgs/arrow-back.png")} style={styles.back} />
        </TouchableOpacity>
        <Text style={styles.title}>{strings.followers}</Text>
      </View>
      <View style={styles.choices}>
        <View style={[styles.switchtitle]}>
          <Text style={styles.choice}>{strings.follow_all}</Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: "##e2e4eb", true: "#5ce5a5" }}
            thumbColor={isEnabled ? "#FFF" : "#FFF"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>

      <View style={{ opacity: bgc.opacity }}>
        <Text style={styles.newsTitle}>{strings.actuality_theme}</Text>
        <FlatList
          style={styles.list}
          data={news?.categories}
          renderItem={({ item }) => render(item)}
          keyExtractor={(item) => item?.id?.toString()}
          extraData={news?.categories}
        />
      </View>
    </View>
  );
};
