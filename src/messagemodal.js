import React, { useContext, useState, useRef, Fragment } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition, Dialog  } from '@headlessui/react';

import { DetailsContext, DetailsDispatchContext, DetailsProvider, ItemContext, ItemDispatchContext, ItemProvider, itemReducer, SettingsContext, SettingsDispatchContext, SettingsProvider, useInterval } from './appcontext';



export const MessageModal = () => {
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