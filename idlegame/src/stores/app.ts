import { defineStore } from 'pinia'

export type AppState = {
  token: string;
  username: string;
}

export const useApp = defineStore("idle-app", {
  state: (): AppState => ({
    token:
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0Y2FycmVpcm8iLCJyb2xlcyI6WyJBRE1JTiIsIkdBTUVfTUFTVEVSIiwiUExBWUVSIl0sImlhdCI6MTc1MDY3NzEzNiwiZXhwIjoxNzUwNzYzNTM2fQ.UTyaNJq-spQr60HTC2vSmrY80wmbFiK7jyk4EoF_9yM",
    username: "tcarreiro",
  }),
  persist: true,
  actions: {
    setToken(token: string) {
      if (token) {
        this.$state.token = token;
      }
    },
    setUsername(username: string) {
      if (username) {
        this.$state.username = username;
      }
    },
  },
  getters: {},
});
