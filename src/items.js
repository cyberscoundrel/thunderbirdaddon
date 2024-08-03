import React, { useContext, useEffect, useReducer, useRef } from 'react';
import './appcontext'
import { ItemContext, ItemDispatchContext } from './appcontext';
import ContentEditable from 'react-contenteditable';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import DatePicker from "react-datepicker";


const Item = (props) => {
    const dispatch = useContext(ItemDispatchContext)
    const forceUpdate = useReducer(x => x + 1, 0)[1]
    const [dpo, setDpo] = React.useState(false)
    const DropDownSelect = (dprops) => {

        useEffect(() => {
            if(props.item[dprops.property] == undefined && dprops.setDefault){
                handleField(dprops.property, dprops.default)
            }

        }, [])
        return (
            <div>
                <Popover>
                    <PopoverButton>
                        <div>{props.item[dprops.property] ? props.item[dprops.property] : (dprops.default? dprops.default : 'default')}</div>
                    </PopoverButton>
                    <PopoverPanel className='absolute z-10'>
                        <div className='bg-slate-400 rounded-sm flex flex-col'>{dprops.options.filter((e) => e != (props.item[dprops.property] ? props.item[dprops.property] : '')).map((e,i) =>
                            <div onClick={() => handleField(dprops.property, e)}>{e}</div>
                        )}</div>
                    </PopoverPanel>
                </Popover>
            </div>
        )
    }
    let toggleDW = () => {
        dispatch({
            type: 'update',
            index: props.index,
            state: {
                dwcheck: !props.item.dwcheck
            }
        })

    }
    let toggleField = (field) => {
        dispatch({
            type: 'update',
            index: props.index,
            state: {
                [field]: props.item[field]? !props.item[field] : true
            }
        })
    }
    /*let toggleAvailable = () => {
        dispatch({
            type: 'update',
            index: props.index,
            state: {
                availCheck: !props.item.availCheck
            }
        })

    }*/
    let toggleInclude = () => {
        dispatch({
            type: 'update',
            index: props.index,
            state: {
                icheck: !props.item.icheck
            }
        })
        
    }
    let handleField = (field, data, re = /(.*)/, cond = (e) => true) => {

        if(re.test(data) && cond(data)) {
            
            dispatch({
                type: 'update',
                index: props.index,
                state: {
                    [field]: data
                }
            })
        }else{
            forceUpdate()
        }
    }
    
    return (
        <tr className='*:pr-4'>
            
            <td className='pr-2'>
                <input onChange={toggleInclude} defaultChecked={props.item.icheck} type='checkbox'></input>
            </td>
            <td><ContentEditable 
            html={props.item ? props.item.item : 'no item'}
            disabled={props.item? !props.item.icheck : true}
            onChange={(e) => handleField('item', e.target.value)} /></td>
            <td><ContentEditable 
            html={props.item ? props.item.quantity : 'no quant'}
            disabled={props.item? !props.item.icheck : true}
            onChange={(e) => handleField('quantity', e.target.value, /^[0-9]+$/)} /></td>
            
            <td><div className='flex flex-row'><ContentEditable 
            html={props.item ? props.item.tq : 'no tq'}
            disabled={props.item? !props.item.icheck : true}
            onChange={(e) => handleField('tq', e.target.value, /^[0-9]+$/)} /><div> X </div><div><Popover><PopoverButton>{props.item? props.item.duration : 'no dur'}</PopoverButton><PopoverPanel className='absolute z-10'><div className='bg-slate-400 rounded-sm flex flex-col'>
            {['hour','day','week','month'].filter((el) => el != (props.item ? props.item.duration : '')).map((e,i) => 
                <div onClick={() => handleField('duration', e)}>{e}</div>
            )}</div></PopoverPanel></Popover></div></div></td>
            <td><ContentEditable 
            html={props.item ? props.item.price : 'no price'}
            disabled={props.item? !props.item.icheck : true}
            onChange={(e) => handleField('price', e.target.value, /^[0-9.]+$/)} /></td>
            <td><div className='flex flex-col'><Popover>
                <PopoverButton>
                    <div>{props.item? props.item.status : 'not available'}</div>
                </PopoverButton>
                <PopoverPanel className='absolute z-10'><div className='bg-slate-400 rounded-sm flex flex-col'>
                    {['available', 'partial', 'partial before', 'partial after','not available','available before', 'available after','other store'].filter((el) => el != (props.item ? props.item.status : '')).map((e,i) => 
                        <div onClick={() => handleField('status', e)}>{e}</div>
                    )}</div>
                </PopoverPanel>
            </Popover>{['partial before', 'partial after', 'available before', 'available after'].includes(props.item.status) ? <><Popover><PopoverButton><div>{props.item.statusDate? props.item.statusDate.toLocaleDateString() : 'tomorrow'}</div></PopoverButton><PopoverPanel className='absolute z-10'><DatePicker onChange={(e) => handleField('statusDate', e)} inline></DatePicker></PopoverPanel></Popover>
            <DropDownSelect options={['morning', 'afternoon', '----']} property={'statusTime'} default={'----'} setDefault></DropDownSelect></> : <></>}</div></td>
            <td>
                <input onChange={toggleDW} defaultChecked={props.item.dwcheck}type='checkbox'></input>
            </td>
            <td>
                <input onChange={() => toggleField('inquire')} defaultChecked={props.item.inquire? props.item.inquire : false}type='checkbox'></input>
            </td>
            {/*<div>
                <label>available</label>
                <input onChange={} type='checkbox'></input>
            </div>*/}
            

        </tr>
    )

}

export const Items = (props) => {
    const items = React.useContext(ItemContext)
    return (
        <table className='table-auto'>
            <thead>
                <tr className='*:pr-4'>
                    <th></th>
                    <th>item</th>
                    <th>quantity</th>
                    <th>duration</th>
                    <th>price</th>
                    <th>status</th>
                    <th>damage waiver</th>
                    <th>inquire use</th>
                </tr>
            </thead>
            <tbody>
                {items.map((e, i) => {
                    return (
                    <Item original={props.original? props.original[i] : undefined} item={e} index={i} ></Item>
                )
                    
                })}
            </tbody>
        </table>
    )
}