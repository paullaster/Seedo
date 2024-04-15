import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
    theme: {
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#86B6F6',
                    secondary: '#EEF5FF',
                    accent: '#B4D4FF',
                    error: '#E72929',
                    info: '#176B87',
                    success: ' #03C988',
                    danger: '#E72929',
                    warning: '#FFC94A',
                }
            }
        }
    }
})