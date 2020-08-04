const state = () => {
  return {
    isPlaying: false,
  };
};

const getters = {
  getIsPlaying: (state) => {
    return state.isPlaying;
  },
};

const mutations = {
  setIsPlaying(state, bool) {
    state.isPlaying = bool;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
