'use client';
import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { OrderList } from 'primereact/orderlist';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';

import type { WithId, Document, InsertOneResult } from "mongodb";
import { addItem } from '@/actions';
import { useDebounce } from 'primereact/hooks';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { NextRequest } from 'next/server';
import { getClientBuildManifest } from 'next/dist/client/route-loader';
import { useRouter } from 'next/navigation';
import { getUUID } from '@/actions';

const List = () => {
  const [items, setItems] = useState([]);
  // const itemsRef = useRef(null);
  const [itemInputValue, setItemInputValue] = useState('');
  const [addItemResult, setAddItemResult] = useState<InsertOneResult<Document> | null>(null);
  const router = useRouter();
  const intervalId = useRef<NodeJS.Timeout>();
  const [isEditing, setIsEditing] = useState(false);
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const getItems = useCallback(async () => {
    // if(isEditing) return;
    const url = '/api/items';
    const items = await fetch(url).then(res => res.json());
    setItems(items);
  }, []);

  useEffect(() =>  {
    if(!window) return
    const { innerWidth: width, innerHeight: height } = window
    setWidth(width)
    setHeight(height)

    window.addEventListener('resize', () => {

    const { innerWidth: width, innerHeight: height } = window
    setWidth(width)
    setHeight(height)

    })
  },[])

  const ListItem = ({ name, completed, id }: { name: string, completed: string, id: string | undefined }) => {
    const [done, setDone] = useState<boolean>((completed === "true") ? true : false);
    const [text, setText] = useState(name);
    const oldTextRef = useRef(name);
    const textRef = useRef(name);

    const onEdited = async () => {
      if (text === '' || !!text.match(/^\s+$/)) return;
      const url = '/api/item';
      // const req = new NextRequest(url, { method: 'POST', body: JSON.stringify({ oldName: oldTextRef.current, newName: text, id }), headers: { action: 'update' } });
      const res = await fetch(url, { method: 'POST', body: JSON.stringify({ oldName: oldTextRef.current, newName: text, id }), headers: { action: 'update' } });
      getItems();
      intervalId.current = setInterval(getItems, 10000);
      setIsEditing(false);
    }

    return (
      <div className='flex-col  justify-start' id={id} >
        <div className='flex spacing-x-4 align-baseline justify-center hover:[&_i:text-black] hover:[&_i:font-black]'>
          <Checkbox pt={{ input: { className:'bg-white text-gray-400 stroke-gray-400' }, root: { className: '!border-gray-400 !border-style-solid !border-2 rounded-md h-full' }, icon: { className: 'hover:[stroke-gray-400]' } }} checked={done} onChange={async e => {
            setDone(e.checked as boolean);
            await fetch('/api/item', { method: 'POST', body: JSON.stringify({ name, id }), headers: { action: 'toggle' } })
          }} className={`mx-2 my-auto ${done ? ' border-gray-400 decoration-gray-400 bg-gray-400' : 'border-black'}`} />
          <Inplace pt={{ root: { className: 'align-baseline justify-center leading-9' }, display: { className: `font-bold xs:text-2xl md:text-3xl ${done ? 'line-through text-gray-400' : 'text-black'}` }, content: { className: 'text-black xs:text-sm md:text-3xl  font-bold' } }}
            onOpen={() => {
              oldTextRef.current = text
              setIsEditing(true);
              clearInterval(intervalId.current);
            }}

            onBlur={onEdited} >
            <InplaceDisplay >
              {text}
            </InplaceDisplay>
            <InplaceContent>
              <InputText value={text} onChange={e => setText(e.target.value)} onKeyUp={e => {
                if (e.code === 'Enter') onEdited();
              }} />
            </InplaceContent>
          </Inplace>
          <Button unstyled className='mr-0 ml-auto [&_i:hover:text-gray-400]' onClick={async () => {
            await fetch(`/api/item`, { method: 'POST', body: JSON.stringify({ name, id }), headers: { action: 'delete' } });
            getItems();
          }} >
            <i className='pi pi-times text-3xl text-gray-400 px-8' ></i>
          </Button>
        </div>
        <Divider type='solid' className='w-full mx-0 border-2' />
      </div>
    )

  }
  const itemTemplate: (item: { name: string, completed: boolean, id: string }) => ReactNode = item => {

    return (
      <ListItem {...{ name: item.name, completed: item.completed ? "true" : "false", id: item.id }} />
    )
  }

  useEffect(() => {

    if (!isEditing) {

      clearInterval(intervalId.current);

      getItems();

      intervalId.current = setInterval(getItems, 10000);
    }

  }, [getItems, isEditing]);



  return (
    <>
      <div className={`relative flex-col lg:mx-auto lg:w-5/12  lg:border-white lg:border-2 m-0 bg-white z-0`}  style={{height:`${height}px`}}>
        <OrderList unstyled dataKey='items' {...{ value: items, itemTemplate, header: `Shopping List (${items.length} item${items.length !== 1 ? 's' : ''})`, onChange: e => setItems(e.value) }} pt={{ header: { className: 'w-full flex m-auto lg:m-auto z-30 bg-white text-black p-2 font-bold text-3xl border-b-gray-400 border-style-solid border-2 m-0 lg:m-auto !align-middle justify-center' }, list: { className: 'w-full m-0 overflow-scroll', style:{height: `calc(${height}px - 6.4rem) `} }, root: { className: 'relative bg-white w-full m-0 text-center flex-col', style:{height: `calc(${height}px - 6.4rem)`} }, container: { className: 'lg:h-screen min-h-screen m-0 w-full flex-col', style:`${height}px` }, controls: { className: 'hidden' } }} />
        <div className='absolute bottom-0  flex justify-center justify-self-end w-full min-h-16 z-50 bg-black p-2 lg:py-4 my-0 lg:mx-auto' >
          <InputText className='text-black border-2 border-white text-3xl w-10/12  m-1 ' value={itemInputValue} onChange={e => {
            setItemInputValue(e.target.value);
          }}
            pt={{
              root: {
                className: 'lg:w-9/12 border-2 border-white',
                onKeyDown: async (e) => {
                  if(itemInputValue === '') return
                  if (e.code === 'Enter') {
                    const uuid = await fetch('/api/uuid').then(res => res.json()).then(json => json.uuid);
                    await fetch(`/api/item`, { method: 'POST', body: JSON.stringify({ name: itemInputValue, id: `${uuid}` }), headers: { action: 'add' } });
                    setItemInputValue('');
                    getItems();
                  }
                }
              }
            }}
          />
          <Button severity='secondary' icon='pi pi-plus text-white text-3xl' className='text-3xl w-2/12 border-2 border-white' pt={{ root: { className: 'bg-black border-2 border-white z-[25]' }, label: { className: 'text-white, z-50' } }} raised onClick={async () => {
            const uuid = await fetch('/api/uuid').then(res => res.json()).then(json => json.uuid);

            await fetch(`/api/item`, { method: 'POST', body: JSON.stringify({ name: itemInputValue, id: `${uuid}` }), headers: { action: 'add' } }).then(res => res.json()).then(json => json.uuid);
            setItemInputValue('');
            getItems();
          }} />
          
        </div>
        
      </div>
    </>
  );
}

export default List