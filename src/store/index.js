import Vue from 'vue';
import Vuex from 'vuex';
import links from '../store/links';
import error from '../store/error';
import loading from '../store/loading';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { links, error, loading }
})
