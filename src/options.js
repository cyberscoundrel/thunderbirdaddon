import React, { useContext, useState, useRef, Fragment } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition, Dialog  } from '@headlessui/react';

import DatePicker from "react-datepicker";
import ContentEditable from 'react-contenteditable';
import { clsx } from 'clsx'

import {Items} from './items'

import { DetailsContext, DetailsDispatchContext, DetailsProvider, ItemContext, ItemDispatchContext, ItemProvider, itemReducer, SettingsContext, SettingsDispatchContext, SettingsProvider, useInterval } from './appcontext';
import { MailBodyBuilder } from './util';
import { list, parse } from 'postcss';
import { validateDetails, validateForm, validateItems, originals, newCompose } from './app';


export const Options = () => {
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
            email: details.email,
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
}