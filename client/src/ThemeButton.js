import { useEffect, useState } from "react";
import {  FiMoon, FiSun } from "react-icons/fi";

function ThemeButton() {
    const [darkMode, setDarkMode] = useState(true);

    const changeTheme = () => {
        let dark = !darkMode;
        let theme = dark ? 'dark' : 'light';
        setDarkMode(dark);
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if(theme) {
            setDarkMode(theme === 'dark');
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [])


    return ( 
        <div className="theme-button" onClick={changeTheme}>
            {darkMode ? <FiSun/> : <FiMoon/> }
        </div>
    );
}

export default ThemeButton;