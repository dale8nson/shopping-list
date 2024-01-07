'use client';
import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { OrderList } from 'primereact/orderlist';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import type { WithId, Document, InsertOneResult } from "mongodb";
import { addItem } from '@/actions';
import { useDebounce } from 'primereact/hooks';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { NextRequest } from 'next/server';
import { getClientBuildManifest } from 'next/dist/client/route-loader';
import { useRouter } from 'next/navigation';

const List = ({ baseUrl }: { baseUrl: string }) => {
  console.log(`baseUrl:`, baseUrl);
  const [items, setItems] = useState([]);
  // const itemsRef = useRef(null);
  const [itemInputValue, setItemInputValue] = useState('');
  const [addItemResult, setAddItemResult] = useState<InsertOneResult<Document> | null>(null);
  const [itemsNeedUpdate, setItemsNeedUpdate] = useState(true);
  const router = useRouter();

  const getItems = async () => {
    const url = new URL('/api/items', baseUrl);
    console.log(`url.href:`, url);
    const req = new NextRequest(url);
    console.log(`url:`, url);
    const items = await fetch(new NextRequest(url)).then(res => res.json());
    setItems(items);
  }

  const ListItem = ({ name, completed, id }: { name: string, completed: string, id: string | undefined }) => {
    const [done, setDone] = useState<boolean>((completed === "true") ? true : false);

    return (
      <div className='flex-col align-middle justify-center' id={id} >
        <div className='flex justify-between hover:[&_i:text-black] hover:[&_i:font-black]'>
          <Checkbox checked={done} onChange={async e => {
            setDone(e.checked as boolean);
            await fetch(new NextRequest(new URL('/api/item', baseUrl), { method: 'POST', body: JSON.stringify({ name }), headers: { action: 'toggle' } }))
          }} className={`mx-2 my-auto ${done ? ' border-gray-400 decoration-gray-400 bg-gray-400' : 'border-black'}`} />
          <div className={`font-bold text-3xl ${done ? 'line-through text-gray-400' : 'text-black'}`}>{name}</div>
          <Button unstyled className='mr-0 ml-auto [&_i:hover:text-gray-400]' onClick={async () => {
            await fetch(new NextRequest(new URL(`/api/item`, baseUrl), { method: 'POST', body: JSON.stringify({ name, id }), headers: { action: 'delete' } }));
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

  console.log(`itemInputValue:`, itemInputValue);

  useEffect(() => {

    getItems();

    setInterval(getItems, 10000);

  }, []);



  return (
    <>
      <div className='flex-col md:my-4 xs:m-0 absolute top-0 left-0 bg-white h-[100vh] w-[100vw] overflow-hidden' >
        <OrderList unstyled className='!h-[100vh]' {...{ value: items, itemTemplate, header: 'Shopping List', onChange: e => setItems(e.value) }} dragdrop pt={{ header: { className: 'fixed top-0 left-0 w-[100vw] xs:h-[10%] [z-index:20] !bg-white/30 backdrop-blur-md text-black p-2 font-bold text-4xl border-b-gray-400 border-style-solid border-2 m-0 p-2' }, list: { className: 'sticky !top-[10%] left-0 w-full xs:!h-[90%] sm:!h-[70%] [z-index:15] overflow-scroll ' }, root: { className: '!h-[90vh] absolute w-[100vw] [z-index:5]' }, container: { className: 'absolute top-[10%] !h-[85%] w-full [z-index:10] overflow-scroll' }, controls: { className: 'hidden' } }} />
        <div className='flex justify-center space-x-2 fixed bottom-0 left-0 xs:h-[15%] sm:h-[15%] ![z-index:17] bg-black p-4 m-0 w-full' >
          <InputText className='text-black text-3xl w-9/12 h-auto ml-0 mr-auto ' value={itemInputValue} onChange={e => {
            console.log(`e:`, e);
            setItemInputValue(e.target.value);
          }} />
          <Button severity='secondary' className='text-3xl w-3/12' pt={{ root: { className: 'bg-black' } }} raised label={'Add'} onClick={async () => {
            console.log(`addItemResult:`, await fetch(new NextRequest(new URL(`/api/item`, baseUrl), { method: 'POST', body: JSON.stringify({ name: itemInputValue, id: crypto.randomUUID() }), headers: { action: 'add' } })));
            setItemInputValue('');
            getItems();
          }} />
        </div>
      </div>
    </>
  );
}

export default List

export const dynamic = 'force-dynamic';