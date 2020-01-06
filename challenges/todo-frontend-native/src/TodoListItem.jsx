import React, { useState, memo } from 'react';
import { View, StyleSheet, PanResponder, Animated, Dimensions, TouchableHighlight, Text, TouchableOpacity } from 'react-native';
import { List, IconButton, Button } from 'react-native-paper';

const width = 0.3 * Math.round(Dimensions.get('window').width)
const TodoListItem = memo(({ item, onItemPress, onItemChange, onItemDelete, updateScroll }) => {
    const gestureDelay = -35;
    const scrollViewEnabled = true;
    const [position, setPosition] = useState(new Animated.ValueXY())

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            const {dx, dy} = gestureState;
            const touchThreshold = 50
            return (Math.abs(dx) > touchThreshold) || (Math.abs(dy) > touchThreshold);
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
            if (gestureState.dx > 35) {
                updateScroll(false);
                let newX = gestureState.dx + gestureDelay;
                position.setValue({x: newX, y: 0});
            }
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dx < 150) {
                Animated.timing(position, {
                    toValue: {x: 0, y: 0},
                    duration: 150,
                }).start(() => {
                    updateScroll(true);
                });
            } else {
                Animated.timing(position, {
                    toValue: {x: width, y: 0},
                    duration: 300,
                }).start(() => {
                    updateScroll(true);
                });
            }
        },
    });

    return (
        <View style={styles.listItem}>
            <Animated.View 
                style={[position.getLayout()]} 
                {...panResponder.panHandlers}
            >
                <View style={styles.todoConfig} onStartShouldSetResponderCapture={event => false} onMoveShouldSetResponderCapture={event => false}>
                    <View style={styles.todoConfigItem}>
                        <TouchableOpacity  style={[styles.todoConfigItem]} onPress={() => onItemChange(item)}>
                            <IconButton icon="pencil" size={28} color={'#ffcc00'} animated={true}/>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.todoConfigItem}>
                        <TouchableOpacity style={[styles.todoConfigItem]} onPress={() => onItemDelete(item)}>
                            <IconButton icon="delete" size={28} color={'#cc0000'} animated={true}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.todoContent}>
                    <List.Item
                        id={item._id}
                        divider
                        title={item.title}
                        description={item.description}
                        onPress={() => onItemPress(item)}
                    />
                </View>
            </Animated.View>
        </View>
    )
})

const styles = StyleSheet.create({
    listItem: {
        marginLeft: -width,
    },
    todoConfig: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: width,
        flexDirection: 'row',
    },
    todoConfigItem: {
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    todoContent: {
        marginLeft: width,
    },
})

export default TodoListItem