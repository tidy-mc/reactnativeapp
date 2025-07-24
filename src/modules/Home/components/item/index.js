// tools
import React from "react";
//rn comp
import { Image, Text, TouchableOpacity, View } from "react-native";
// nav
// ...
// import { Actions } from "react-native-router-flux";
// styles
import styles from "./styles";
// libs
import { Capitalize } from "lib/Capitalise";
import strings from "locales/fr";
import gaSendLoadAppEvent from "services/ga-api";
import { useSelector } from "react-redux";
import { navigate } from "router/navigator";
import Details from "modules/Home/containers/Details";

export default ({ data }) => {
  const currentUser = useSelector(
    (state) => state.global.currentUser
  );

  const getElapsedTime = (date) => {

    let diff = {}
    let tmp = Date.now() - date;

    tmp = Math.floor(tmp / 1000);
    diff.sec = tmp % 60;

    tmp = Math.floor((tmp - diff.sec) / 60);
    diff.min = tmp % 60;

    tmp = Math.floor((tmp - diff.min) / 60);
    diff.hour = tmp % 24;

    tmp = Math.floor((tmp - diff.hour) / 24);
    diff.day = tmp;

    if (diff.day > 365)
      return "Il y a plus d'un an"
    else if (diff.day > 1)
      return "Il y a " + diff.day + " jours"
    else if (diff.hour > 1)
      return "Il y a " + diff.hour + " heures"
    else if (diff.min > 1)
      return "Il y a " + diff.min + " minutes"
    else
      return "Il y a " + diff.sec + " secondes"
  }
  const badgeDate = (data) => {
    return <Text style={styles.badge}>{getElapsedTime(data)}</Text>;
  };

  return (
    <TouchableOpacity onPress={() => {

      // Track GA Open News EVENTS
      gaSendLoadAppEvent(currentUser?.id?.toString(), "news_click", { "newsId": data?.id });
      // ...
      // Actions.Details({ data: data });
      // navigate('Details', { data: data });
      navigate("Details", { data: data });

    }} activeOpacity={0.8}>
      <View style={styles.container}>
        {data?.thumbnail ? (
          <View style={styles.imageContent}>
            <Image source={{ uri: data?.thumbnail + '?w=760&h=260' }} resizeMode="cover" style={styles.image} />
          </View>
        ) : (
          <View style={styles.badgeContent}>
            {badgeDate(data?.modifiedAt)}
          </View>
        )}

        <View style={data?.thumbnail ? styles.descContent : [styles.descContent, styles.withoutImage]}>
          {data?.featured &&
            <Text style={styles.status}>{strings.featured}</Text>
          }
          <Text style={styles.title}>{data?.title.toUpperCase()}</Text>
          <Text style={styles.description}>{Capitalize(data?.label)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
