import {createStore} from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import moduleStore from './modules/module'
import getters from './getters'

const store = createStore({
    modules: {
        app,
        user,
        tagsView,
        permission,
        settings,
        module: moduleStore
    },
    getters
});


export default store
