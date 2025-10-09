export type ConfigProps = {
    Sidebar_drawer: any;
    mini_sidebar: boolean;
    setHorizontalLayout: boolean;
    actTheme: string;
    boxed: boolean;
    setBorderCard: boolean;
    showAlert: boolean;
};

const config: ConfigProps = {
    Sidebar_drawer: null,
    mini_sidebar: true,
    setHorizontalLayout: false, // Horizontal layout
    actTheme: 'LIGHT_THEME', // CYAN_THEME BLUE_THEME ORANGE_THEME
    boxed: false,
    setBorderCard: false,
    showAlert: false,
};

export default config;
