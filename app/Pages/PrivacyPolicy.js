'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import BigButton from '../Components/BigButton.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import ArrowLink from '../Components/ArrowLink.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
} from 'react-native';

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView style={styles.ppContainer}>
          <Text style={styles.ppHeading}>Data Controller and Owner</Text>
          <Text style={styles.ppHeading}>Types of Data Collected</Text>
            <Text style={styles.ppParagraph}>Among the types of Personal Data that this Application collects,
          by itself or through third parties, there are: email address, first and last name, phone number,
          text responses to questions or ‘secrets’, and User ID.</Text>
            <Text style={styles.ppParagraph}>Other Personal Data collected may be described in other
          sections of this privacy policy or by dedicated explanation text contextually with the Data collection.</Text>
            <Text style={styles.ppParagraph}>The Personal Data may be freely provided by the User, or collected automatically
          when using this Application.</Text>
            <Text style={styles.ppParagraph}>Any use of Cookies - or of other tracking tools - by this Application
          or by the owners of third party services used by this Application, unless stated otherwise, serves to identify
          Users and remember their preferences, for the sole purpose of providing the service required by the User.</Text>
            <Text style={styles.ppParagraph}>Failure to provide certain Personal Data may make it impossible for this
          Application to provide its services.</Text>
            <Text style={styles.ppParagraph}>Users are responsible for any Personal Data of third parties obtained, published
          or shared through this Application and confirm that they have the third partys consent to provide the Data to the Owner.</Text>
            <Text style={styles.ppParagraph}></Text>
            <Text style={styles.ppParagraph}></Text>
          <Text style={styles.ppHeading}>Mode and place of processing the Data</Text>
          <Text style={styles.ppHeading}>Methods of processing</Text>
            <Text style={styles.ppParagraph}>The Data Controller processes the Data of Users in a proper manner and shall take appropriate
          security measures to prevent unauthorized access, disclosure, modification, or unauthorized destruction of the Data. The Data
          processing is carried out using computers and/or IT enabled tools, following organizational procedures and modes strictly related
          to the purposes indicated. In addition to the Data Controller, in some cases, the Data may be accessible to certain types of
          persons in charge, involved with the operation of the site (administration, sales, marketing, legal, system administration) or
          external parties (such as third party technical service providers, mail carriers, hosting providers, IT companies, communications
            agencies) appointed, if necessary, as Data Processors by the Owner. The updated list of these parties may be requested from the
            Data Controller at any time.</Text>
          <Text style={styles.ppHeading}>Place</Text>
            <Text style={styles.ppParagraph}>The Data is processed at the Data Controllers operating offices and in any other places where the
          parties involved with the processing are located. For further information, please contact the Data Controller.</Text>
          <Text style={styles.ppHeading}>Retention time</Text>
            <Text style={styles.ppParagraph}>The Data is kept for the time necessary to provide the service requested by the User, or stated by
          the purposes outlined in this document, and the User can always request that the Data Controller suspend or remove the data.</Text>
          <Text style={styles.ppHeading}>The use of the collected Data</Text>
            <Text style={styles.ppParagraph}>The Data concerning the User is collected to allow the Owner to provide its services, as well as for
          the following purposes: Access to third party accounts and Contacting the User. The Personal Data used for each purpose is outlined in
          the specific sections of this document.</Text>
            <Text style={styles.ppParagraph}>The Application will not contact the User through email for promotional purposes. The Application
          may contact the User for system purposes, such as resetting the User’s password at the User’s request. </Text>
          <Text style={styles.ppHeading}>Facebook permissions asked by this Application</Text>
            <Text style={styles.ppParagraph}>This Application may ask for some Facebook permissions allowing it to perform actions with the Users
          Facebook account and to retrieve information, including Personal Data, from it. For more information about the following permissions,
          refer to the Facebook permissions documentation and to the Facebook privacy policy. The permissions asked are the following:</Text>
          <Text style={styles.ppHeading}>Basic information</Text>
            <Text style={styles.ppParagraph}>By default, this includes certain User’s Data such as id, name, and email. Certain connections of
          the User, such as the Friends, are also available. If the User has made more of their Data public, more information will be available.</Text>
          <Text style={styles.ppHeading}>Contacts permissions asked by this Application</Text>
            <Text style={styles.ppParagraph}>This Application asks for permission to access the User’s phone number contacts, to make it easier for
          the User to contact their friends through the Application. This permission is optional to use the service. The Application will not contact
          anyone in the User’s contacts without the User’s permission.</Text>
          <Text style={styles.ppHeading}>Additional information about Data collection and processing</Text>
          <Text style={styles.ppHeading}>Legal action</Text>
            <Text style={styles.ppParagraph}>The Users Personal Data may be used for legal purposes by the Data Controller, in Court or in the stages
          leading to possible legal action arising from improper use of this Application or the related services. The User declares to be aware that
          the Data Controller may be required to reveal personal data upon request of public authorities.</Text>
          <Text style={styles.ppHeading}>Additional information about Users Personal Data</Text>
            <Text style={styles.ppParagraph}>In addition to the information contained in this privacy policy, this Application may provide the User
          with additional and contextual information concerning particular services or the collection and processing of Personal Data upon request.</Text>
          <Text style={styles.ppHeading}>System logs and maintenance</Text>
            <Text style={styles.ppParagraph}>For operation and maintenance purposes, this Application and any third party services may collect files
          that record interaction with this Application (System logs) or use for this purpose other Personal Data (such as IP Address).</Text>
          <Text style={styles.ppHeading}>Information not contained in this policy</Text>
            <Text style={styles.ppParagraph}>More details concerning the collection or processing of Personal Data may be requested from the Data
          Controller at any time. Please see the contact information at the beginning of this document.</Text>
          <Text style={styles.ppHeading}>The rights of Users</Text>
            <Text style={styles.ppParagraph}>Users have the right, at any time, to know whether their Personal Data has been stored and can consult
          the Data Controller to learn about their contents and origin, to verify their accuracy or to ask for them to be supplemented, cancelled,
          updated or corrected, or for their transformation into anonymous format or to block any data held in violation of the law, as well as to
          oppose their treatment for any and all legitimate reasons. Requests should be sent to the Data Controller at the contact information set
          out above. This Application does not support “Do Not Track” requests. To determine whether any of the third party services it uses honor
          the “Do Not Track” requests, please read their privacy policies.</Text>
          <Text style={styles.ppHeading}>Changes to this privacy policy</Text>
            <Text style={styles.ppParagraph}>The Data Controller reserves the right to make changes to this privacy policy at any time by giving
          notice to its Users on this page. It is strongly recommended to check this page often, referring to the date of the last modification
          listed at the bottom. If a User objects to any of the changes to the Policy, the User must cease using this Application and can request
          that the Data Controller remove the Personal Data. Unless stated otherwise, the then-current privacy policy applies to all Personal Data
          the Data Controller has about Users.</Text>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

// <Text style={styles.ppHeading}></Text>
// <Text style={styles.ppParagraph}></Text>

const styles = StyleSheet.create({
  ppContainer: {
    padding: 8,
  },
  ppHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  ppParagraph: {
    fontSize: 14,
    marginBottom: 8,
  }
});

module.exports = PrivacyPolicy;
