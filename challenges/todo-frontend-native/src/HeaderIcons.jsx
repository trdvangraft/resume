import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { HeaderButtons, HeaderButton } from 'react-navigation-header-buttons'

const MaterialHeaderButton = props => (
    <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={27} color="black" />
);

export const MaterialHeaderButtons = props => {
    return (
        <HeaderButtons
            HeaderButtonComponent={MaterialHeaderButton}
            OverflowIcon={<MaterialIcons name="more-vert" size={27} color="black" />}
            {...props}
        />
    )
}

export { Item } from 'react-navigation-header-buttons'