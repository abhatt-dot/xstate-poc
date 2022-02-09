import { createMachine, assign } from 'xstate';

const searchMachine = createMachine({
    id: 'search',
    initial: 'default',
    context: {
      canSearch: true,
      searchTerm: null,
    },
    states: {
      disabled: {
        on: {
          ACTIVATE: {
            target: 'default',
            actions: assign({
              canSearch: (_, event) => event.searchEnabled
            }),
          }
        }
      },
      default: {
        on: {
          SEARCH: {
            target: 'searching',
            actions: assign({
              searchTerm: (_, event) => event.query
            }),
            cond: 'searchValid'
          },
          SYNC: {
            target: 'disabled',
            actions: assign({
              canSearch: (_, event) => event.searchEnabled
            }),
          }
        }
      },
      searching: {
        on: {
          RESULT: { 
            target: 'reset'
          }
        }
      },
      reset: {
        on: {
          CLEAR: {
            target: 'default'
          },
          SEARCH: {
            target: 'searching'
          },
        }
      }
    },
  },
  {
    guards: {
      searchValid: (_, event) => event.query.length > 0 ? true : alert('This is not a valid search value'),
    }
  }
)

export default searchMachine;