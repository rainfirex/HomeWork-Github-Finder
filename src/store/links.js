export default {
    state: {
        links: [
            {title: 'Домашняя', path: '/'},
            {title: 'О программе', path: '/about'}
        ]
    },

    getters: {
        getLinks(state) {
            return state.links;
        }
    },

    mutations: {

    },

    actions: {

    }
}