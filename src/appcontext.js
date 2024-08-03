import React, {useRef, useEffect} from "react";

export const ItemContext = React.createContext([])

export const DetailsContext = React.createContext({})

export const DetailsDispatchContext = React.createContext(null)

export const SettingsContext = React.createContext(null)

export const SettingsDispatchContext = React.createContext(null)

export const useInterval = (callback, delay) => {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

export const itemReducer = (items, action) => {
    console.log(...items)
    switch(action.type){
        case 'add':
            return [...items, {...action.data}]
        case 'append':
            return [...items, ...action.list]
        case 'update':
                return [...items.slice(0,action.index),
                    {...items[action.index], ...action.state},
                    ...items.slice(action.index + 1)
                ]

        default: {
          throw Error('Unknown action: ' + action.type);
        }

    }
}

export const detailsReducer = (details, action) => {
    switch(action.type){
        case 'set':
            return {...details, ...action.data}
        default: {
          throw Error('Unknown action: ' + action.type);
        }

    }

}

export const ItemDispatchContext = React.createContext(null)


export const ItemProvider = ({children}) => {
    let [items, dispatch] = React.useReducer(itemReducer,[])
    return (

        <ItemDispatchContext.Provider value={dispatch}>
            <ItemContext.Provider value={items}>
                {children}
            </ItemContext.Provider>
        </ItemDispatchContext.Provider>
    )
}

export const DetailsProvider = ({children}) => {
    let [details, dispatch] = React.useReducer(detailsReducer,{
        debug: false
    })
    return (

        <DetailsDispatchContext.Provider value={dispatch}>
            <DetailsContext.Provider value={details}>
                {children}
            </DetailsContext.Provider>
        </DetailsDispatchContext.Provider>
    )
}

export const SettingsProvider = ({children}) => {
    let [settings, dispatch] = React.useReducer(detailsReducer, {
        open: false
    })
    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <SettingsContext.Provider value={settings}>
                {children}
            </SettingsContext.Provider>
        </SettingsDispatchContext.Provider>
    )

}
