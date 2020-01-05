import React from 'react'
import { View, Button, Text, StyleSheet, SafeAreaView } from "react-native"

const AddTodoModel = props => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>This is a modal</Text>
            <Button
                onPress={() => props.navigation.goBack()}
                title="Dismiss"
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});

export default AddTodoModel