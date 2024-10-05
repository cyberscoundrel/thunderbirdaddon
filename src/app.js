import React, { useContext, useState, useRef, Fragment } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition, Dialog  } from '@headlessui/react';

import DatePicker from "react-datepicker";
import ContentEditable from 'react-contenteditable';
import { clsx } from 'clsx'

import {Items} from './items'

import { DetailsContext, DetailsDispatchContext, DetailsProvider, ItemContext, ItemDispatchContext, ItemProvider, itemReducer, SettingsContext, SettingsDispatchContext, SettingsProvider, useInterval } from './appcontext';
import { MailBodyBuilder } from './util';
import { list, parse } from 'postcss';
import { Header } from './header';
import { Options } from './options';
import { MessageModal } from './messagemodal';

const getMessage = (part0, part1, callback, error = (e) => {console.log(`error ${e}`)}) => {

    return browser.tabs.query({
        active: true,
        currentWindow: true,
    }).then(tabs => {
        let tabId = tabs[0].id;
        console.log(`tab id ${tabId}`)
        browser.messageDisplay.getDisplayedMessages(tabId).then((message) => {
            console.log(`got displayed ${message.messages[0].id}`)

        browser.messages.getFull(message.messages[0].id).then((e) => {
            console.log(e)

            return e.parts[part0].parts[part1].body
        }).then((el) => {
            callback(el)
        }).catch((e) => error(e))


    }).catch((e) => error(e));
  });
}

/*const newCompose = (data) => {
    browser.compose.beginNew(undefined, {
        body: data.body
    })
}*/

export const parseContent = (content) => {
    console.log(`content: ${content}`)
    let emailMatch = [...content.matchAll(remail)]
    let itemsMatch = [...content.matchAll(reitem)]
    let datesMatch = [...content.matchAll(redate)]
    let phonesMatch = [...content.matchAll(rephone)]


    let newItems = {
        email: emailMatch[0][1],
        date: datesMatch[0][1],
        phone: phonesMatch[0][1],
        items: []
    }
    console.log(itemsMatch.length)

    itemsMatch.forEach((e) => {
        newItems.items.push({
                item: e[2],
                quantity: e[1],
                tq: e[3],
                duration: e[4],
                price: e[5],
                status: 'available',
                icheck: true,
                dwcheck: true
    })
    })


    return newItems

}
export const newCompose = (data) => {
    browser.compose.beginNew(undefined, {
        body: data.body
    })
}
export const originals = []
let remail = /E-Mail: ([a-zA-Z0-9-_]+@[a-zA-Z0-9-_.]+)/gu
let reitem = /(\d+)[\s]+?([\S ]+)[\s]+?(\d+) X ([a-zA-Z]*)\(s\)[\s]+?Rental(?:[\s]+?\$([\d.]+))?/gum
//let reitem = /(\d+)[\s]+?([\S ]+)[\s]+?(\d+) X ([a-zA-Z]+)\(s\)[\s]+?Rental[\s]+?\$([\d.]+)/gum
let redate = /Requested rental start date: ([0-9]+\/[0-9]+\/[0-9]+)/gu
let rephone = /Preferred method of contact: ([a-zA-Z- ]+)/gu
/*const Header = (props) => {
    const settingsDispatch = useContext(SettingsDispatchContext)
    const itemDispatch = useContext(ItemDispatchContext)
    const details = useContext(DetailsContext)
    const detailsDispatch = useContext(DetailsDispatchContext)
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    useInterval(() => {
        if(details.messageTime){
            if(details.messageTime > 0){
                detailsDispatch({
                    type: 'set',
                    data: {
                        messageTime: details.messageTime - 1
                    }
                })
            }
        }

    }, 1000)


    
    
    
    let handleCompose = () => {
        newCompose({
            email: details.email,
            body: `Hello,
            
            We received your quote request for: ${'placeholder'}.

            ${'placeholder availability'}
            ${'placeholder damage waiver'}
            ${'placeholder price'}
            ${'placeholder comment'}
            ${'placeholder interest'}

            Thanks,

            ${'placeholder'}
            `
        })
    }
    let handleLoadTestContent = () => {

        [...Array(5)].map((_, i) => {
            console.log('dispatch')
            originals.push({
                item: `item${i}`,
                quantity: `${i}`,
                tq: `${i}`,
                duration: `day`,
                price: `2${i}.00`,
                status: 'available',
                icheck: true,
                dwcheck: true
            })
            itemDispatch({
                type: 'add',
                data: {

                        item: `item${i}`,
                        quantity: `${i}`,
                        tq: `${i}`,
                        duration: `day`,
                        price: `2${i}.00`,
                        status: 'available',
                        icheck: true,
                        dwcheck: true

                }
            })

        })

    }
    const TestingButtons = (props) => {
        return (
        <div className='flex flex-row'>
            <button className='bg-slate-900 p-4 mr-4 text-white rounded-md' onClick={handleCompose} >Test Compose</button>
            <button className='bg-slate-900 p-4 mr-4 text-white rounded-md' onClick={handleLoadTestContent}>Load Test Content</button>
        </div>
        )
    }
    const handleDebug = () => {
        detailsDispatch({
            type: 'set',
            data: !details.debug ? {
                debug: !details.debug,
                messageTime: 2,
                messageCont: 'Loaded Debug'
            } : {
                debug: !details.debug
            }
        })
        
    }
    
    return (
        <div className='flex justify-between pb-4 items-center border-b border-dotted border-neutral-800'>
            <div className='flex'>
                <button className='bg-slate-900 p-4 mr-4 text-white rounded-md' onClick={props.handleExtract}>grab data</button>
                {details.debug ? <TestingButtons /> : <></>}
                
            </div>
            <div className='flex flex-row items-center'>
                <span className='inline-block align-middle'>Quote Machine</span>
                <Popover>
                    <PopoverButton className='p-2 max-w-min max-h-min rounded-sm text-white bg-slate-200 ml-2'>⚙️</PopoverButton>
                    <PopoverPanel className='absolute z-10 right-2'>
                        <div className='p-4 *:mb-2 rounded-sm bg-slate-200 flex flex-col'>
                            <button onClick={handleDebug} className='bg-slate-500 rounded-sm p-2' >Debug</button>
                            <button onClick={() => settingsDispatch({type:'set',data:{open:true}})} className='bg-slate-500 rounded-sm p-2' >Settings</button>
                        </div>
                    </PopoverPanel>
                </Popover>
            </div>
        </div>
    )
}*/
//const emailregex = new RegExp(/(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/ig)
export const validateDetails = (details) => {
    let emailregex = new RegExp(/(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/ig)
    //let valid = true
    if(details.email){
        if(!emailregex.test(details.email)){
            return false
        }   
    }else{
        console.log('no email')
        return false
    }
    
    return true
}
export const validateForm = (details, items) => {
    return validateItems(items) && validateDetails(details)
}
export const validateItems = (items) => {
    let noinclude = items.filter((e) => e.icheck == true)
    if(noinclude.length == 0){
        console.log('zero length noinclude')
        return false
    }
    return true
}/*
const MessageModal = () => {
    const details = React.useContext(DetailsContext)
    const detailsDispatch = React.useContext(DetailsDispatchContext)
    
    

  return (
    <>
      <Transition appear show={details.messageTime > 0 ? true : false} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {details.messageCont}
                    </p>
                  </div>

                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
const Options = () => {
    const items = React.useContext(ItemContext)
    const details = React.useContext(DetailsContext)
    const detailsDispatch = React.useContext(DetailsDispatchContext)
    const handleField = (field, data) => {
        detailsDispatch({
            type: 'set',
            data: {
                [field]: data
            }
        })
    }
    const handleToggle = (field) => {
        detailsDispatch({
            type: 'set',
            data: !details[field]
        })
    }
    const handleCompose = () => {
        let builder = new MailBodyBuilder(items, details, originals)
        newCompose({
            body: builder.ComposeEMailString()
        })
    }
    React.useEffect(() => {
        detailsDispatch({
            type: 'set',
            data: {
                dl: false,
                poi: false
            }
        }
    )},[])
    return (
        <div>
            {items.length > 0 ? 
            <div className='flex flex-col'>
                <div className='flex flex-row *:m-2'>
                    <h3>Email:</h3><ContentEditable 
                    html={details.email? details.email : 'no email'}
                    onChange={(e) => handleField('email', e.target.value)} />
                </div>
                <div className='flex flex-row max-w-[600px] *:m-2'>
                    <h3>Comment:</h3><ContentEditable 
                    html={details.comment? details.comment : ''}
                    onChange={(e) => handleField('comment', e.target.value)}
                    className='w-full break-all' />
                </div>
                <div className='flex flex-row max-w-[600px] *:m-2'>
                    <h3>Date:</h3><div 
                    className='w-full break-all'><Popover>
                        <PopoverButton><div>{details.date? details.date : ''}</div></PopoverButton><PopoverPanel className='absolute z-10'><DatePicker onChange={(e) => handleField('date', e.toLocaleDateString())} inline></DatePicker></PopoverPanel></Popover></div>
                </div>

                <div className='flex flex-row *:m-2'>
                    <h3>Bring:</h3><input type='checkbox'
                    onChange={() => handleToggle('dl')}
                    defaultChecked={details.dl} /><h4>Drivers license and CC</h4>
                    <input type='checkbox'
                    onChange={() => handleToggle('poi')}
                    defaultChecked={details.poi} /><h4>Proof of insurance</h4>
                </div>
                
                <button className={clsx(' max-w-min p-4 mr-4 text-white rounded-md', validateForm(details, items) ? 'bg-slate-800' : 'bg-slate-400')} onClick={handleCompose}>Compose</button>
                
            </div> : <></>}
        </div>
    )
}*/
const Settings = (props) => {
    const settings = useContext(SettingsContext)
    const settingsDispatch = useContext(SettingsDispatchContext)
    return (
        <div className='flex flex-col'>

        </div>
    )
}
const SettingsHeader = (props) => {
    const settingsDispatch = useContext(SettingsDispatchContext)
    return (
        <div>
            <div className='flex flex-row items-center justify-between'>
                <button onClick={() => settingsDispatch({type:'set',data:{open:false}})} className='p-2 w-min h-min rounded-md bg-slate-400'>
                    🔙
                </button>
                <span className='inline-block align-middle'>Settings</span>
            </div>
        </div>
    )
}
const MainApp = () => {
    const settings = useContext(SettingsContext)
    const settingsDispatch = useContext(SettingsDispatchContext)
    let itemsDispatch = React.useContext(ItemDispatchContext)
    
    let detailsDispatch = React.useContext(DetailsDispatchContext)
    let details = React.useContext(DetailsContext)
    let handleExtract = (e) => {
        getMessage(0,0, (e) => {
            let parsedCont = parseContent(e)
            itemsDispatch({
                type: 'append',
                list: parsedCont.items
            })
            detailsDispatch({
                type: 'set',
                data: {
                    email: parsedCont.email,
                    date: parsedCont.date,
                    phone: /phone/.test(parsedCont.phone),
                }
            })
        }, (e) => {
            detailsDispatch({
                type: 'set',
                data: {
                    messageTime: 2,
                    messageCont: `Error grabbing data: ${e}`
                }
            })

        })
        
    }
    return (
        <div>
            <div className='p-4'>
                {settings.open? 
                <div className='w-[600px] h-[600px]'>
                    <SettingsHeader></SettingsHeader>
                    <Settings></Settings>
                </div> : 
                <div><Header handleExtract={handleExtract}></Header>
                    <div className='p-4 mt-4 container-snap overflow-scroll w-full h-full border-dotted border-slate-800 border rounded-md'>
                        <Items ></Items>
                    </div>
                <Options></Options></div>}
                
            
            </div>
        </div>
    )
}

const App = () => {
    //let [email, setEmail] = React.useState()
    //let [cont, setCont] = React.useState()
    //let [items, dispatch] = React.useReducer(itemReducer,[])

    




        return (
            <SettingsProvider>
                <ItemProvider>
                    <DetailsProvider>
                        <MainApp></MainApp>
                        <MessageModal></MessageModal>
                    </DetailsProvider>
                </ItemProvider>
            </SettingsProvider>
        );
    }


export default App;