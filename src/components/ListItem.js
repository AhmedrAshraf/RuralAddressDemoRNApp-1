import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RuralAddress} from '../src/models';
import PropTypes from 'prop-types';
import {ConsoleLogger} from '@aws-amplify/core';

const ListItem = ({item}) => {
  console.log('item: ', item);

  return (
    <TouchableOpacity style={styles.listItem}>
      <View style={styles.listItemView}>
        <Text style={styles.listItemText}>
          {item.id} - {item.status} - {item.link}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  listItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 18,
  },
});

export default ListItem;

ListItem.propTypes = {
  item: PropTypes.instanceOf(RuralAddress).isRequired,
};
