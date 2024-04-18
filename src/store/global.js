import { defineStore } from "pinia";

export const useGlobalStore = defineStore('global', {
    state: () =>{
        return {
            links: [],
        }
    },
    getters: {
        getGlobal: (state) => (key) => state[key]
    },
    actions: {
        addNavLink(payload) {
            try {
                this.$patch({
                    links: [
                       ...this.links,
                        payload
                    ],
                })
            } catch (error) {
                this.toast.error(error.message);
            }
        }
    }
});

