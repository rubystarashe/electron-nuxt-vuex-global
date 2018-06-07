import globalVuex from './globalVuex'

export const plugins = [globalVuex]

export const state = () => ({
  messages: []
})

export const mutations = {
  RECEIVE_MESSAGE (state, message) {
    state.messages.push(message)
  }
}
