// tools
import React, { useEffect } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform
} from "react-native";
// ...
// import { Actions } from "react-native-router-flux";
import { useDispatch, useSelector } from "react-redux";

// styles
import styles from "./styles";

// Actions
import { oneNews } from "modules/Home/actions";

// libs
import "moment/locale/fr";
import { WebView } from "react-native-webview";
import strings from "locales/fr";

import CONFIG from "config/api";
import { useNavigation, useRoute } from "@react-navigation/native";

const { BASE_URL } = CONFIG;

export default (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params;


  // Execute methode on loading the page
  const dispatch = useDispatch();

  // Read from the store variables
  const state = data;

  console.log('=-======= details/cp/index.js', data);

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

  const getUrlRedirection = (data) => {
    if (data.linkType === 'external')
      return data.link + "?utm_source=push_mobile"
    else if (data.linkType === 'document')
      return BASE_URL + '/document/' + data.link + "?utm_source=push_mobile"
    else if (data.linkType === 'page')
      return BASE_URL + '/edito/' + data.link + "?utm_source=push_mobile"
    else if (data.linkType === 'article')
      return BASE_URL + '/news/' + data.slug + "?utm_source=push_mobile"
  }

  // Redirection automatique vers l'article
  useEffect(() => {
    // call news api to increment read count
    oneNews(state.id);
    if (state) {
      Linking.openURL(getUrlRedirection(state));
      // ...
      // Actions.pop()
      navigation.goBack();
    }
  }, [])

  const html = (data) => {

    let style = '<style type="text/css">.button{background:#042b72;padding:8px 15px;display:inline-block;border-radius:4px;color:#fff;text-decoration:none;text-transform:uppercase;font-size:80%}</style>';
    let html = '<div style="margin-bottom:20px">' + data?.description + '</div>'

    if (data.linkType === 'external')
      html += '<a class="button" href="' + data.link + "?utm_source=push_mobile" + '" target="_blank" rel="noopener">Ouvrir le lien</a>'
    else if (data.linkType === 'document')
      html += '<a href="' + BASE_URL + '/document/' + data.link + "?utm_source=push_mobile" + '" target="_blank" class="button">Voir le document</a>'
    else if (data.linkType === 'page')
      html += '<a href="' + BASE_URL + '/edito/' + data.link + "?utm_source=push_mobile" + '" target="_blank" class="button">Voir la page</a>'
    else if (data.linkType === 'article')
      html += '<a href="' + BASE_URL + '/news/' + data.slug + "?utm_source=push_mobile" + '" target="_blank" class="button">Voir l\'article</a>'

    return '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, min-scale=1.0, maximum-scale=1.0">' + style + '<link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"></head><body style="font-family: PT Sans; color: #59595B">' + html + '</body></html>';
  };

  const shouldStartLoadWithRequest = (req) => {
    if (req.url.substring(0, 4) == 'http') {
      Linking.openURL(req.url);
      return false;
    }
    return true;
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.backContent}
        onPress={() => {
          // ...
          // Actions.pop()
          navigation.goBack();
        }}
      >
        <Image
          source={require("assets/imgs/arrow-back.png")}
          style={styles.back}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {state?.thumbnail ? (
        <>
          <Image source={{ uri: state?.thumbnail + '?w=760&h=260' }} resizeMode="cover" style={styles.image} />

          <View style={[styles.textContent, styles.textContentImage]}>
            <View style={styles.direction}>
              <Text style={styles.status}>{state?.featured ? strings.featured : ''}</Text>
            </View>
            <Text style={styles.title}> {state?.title?.toUpperCase()}</Text>
            <WebView originWhitelist={['*']} style={styles.description} source={{ baseUrl: '', html: html(state) }} onShouldStartLoadWithRequest={shouldStartLoadWithRequest} />
          </View>
        </>
      ) : (
        <View style={[styles.textContent, styles.textContentNoImage]}>
          <View style={styles.direction}>
            <Text style={styles.status}>{state?.featured ? strings.featured : ''}</Text>
            <Text style={styles.time}>
              {state?.createdAt && badgeDate(state?.createdAt)}
            </Text>
          </View>
          <Text style={styles.title}> {state?.title?.toUpperCase()}</Text>
          <WebView originWhitelist={['*']} style={styles.description} source={{ baseUrl: '', html: html(state) }} onShouldStartLoadWithRequest={shouldStartLoadWithRequest} />
        </View>
      )}
    </View>
  );
};
