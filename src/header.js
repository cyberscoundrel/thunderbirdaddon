import React, { useContext, useState, useRef, Fragment } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition, Dialog  } from '@headlessui/react';

import DatePicker from "react-datepicker";
import ContentEditable from 'react-contenteditable';
import { clsx } from 'clsx'

import {Items} from './items'

import { DetailsContext, DetailsDispatchContext, DetailsProvider, ItemContext, ItemDispatchContext, ItemProvider, itemReducer, SettingsContext, SettingsDispatchContext, SettingsProvider, useInterval } from './appcontext';
import { MailBodyBuilder } from './util';
import { list, parse } from 'postcss';
import { newCompose } from './app';


export const Header = (props) => {
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
}