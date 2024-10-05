import React from 'react';
import '../Styles.css';
import { Link } from "react-router";

const LinkToFeature = (route, imagePath) => {
    <div classname = "featureLinkContainer">
        <Link to = {route}>
            <input type= 'image' id = 'image' alt = 'icon'
            src = {imagePath}>
            </input>
        </Link>
    </div>
}

export default LinkToFeature