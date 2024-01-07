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

const List = ({ baseUrl }: { baseUrl: string }) => {
  console.log(`baseUrl:`, baseUrl);
  const [items, setItems] = useState([]);
  // const itemsRef = useRef(null);
  const [itemInputValue, setItemInputValue] = useState('');
  const [addItemResult, setAddItemResult] = useState<InsertOneResult<Document> | null>(null);
  const [itemsNeedUpdate, setItemsNeedUpdate] = useState(true);

  const getItems = async () => {
    const url = new URL('/api/items', baseUrl);
    console.log(`url.href:`, url.href);
    const req = new NextRequest(url.href);
    console.log(`url:`, url);
    const items = await fetch(url.href, {next: {revalidate:10}}).then(res => res.json());
    setItems(items);
  }

  const ListItem = ({ name, completed }: { name: string, completed: string }) => {
    const [done, setDone] = useState<boolean>((completed === "true") ? true : false);
    return (
      <div className='flex-col' >
        <div className='flex justify-between'>
          <Checkbox checked={done} onChange={e => setDone(e.checked as boolean)} className={`mx-2 my-auto ${done ? ' border-gray-400 decoration-gray-400 bg-gray-400' : 'border-black'}`} />
          <div className={`font-bold text-3xl ${done ? 'line-through text-gray-400' : 'text-black'}`}>{name}</div>
          <Button className='mr-0 ml-auto' onClick={ async () => {
            await fetch(new NextRequest(new URL(`/api/item`, baseUrl), {method:'POST', body:JSON.stringify({name}),headers:{ action:'delete'}, mode:'no-cors'}));
            await getItems();
          }} >
            <i className='pi pi-times text-3xl' ></i>
          </Button>
        </div>
        <Divider type='solid' className=' border-2' />
      </div>
    )
  
  }
  const itemTemplate: (item: { name: string, completed: boolean }) => ReactNode = item => {

    return (
        <ListItem {...{ name: item.name, completed: item.completed ? "true" : "false" }} />
    )
  }

  console.log(`itemInputValue:`, itemInputValue);
  
  useEffect(() => {

    getItems();

  }, []);
  return (
    <>
      <div className='flex-col md:my-4 xs:m-0 absolute top-0 left-0' >
        <OrderList {...{ value: items, itemTemplate, header: 'Shopping List', onChange: e => setItems(e.value) }} dragdrop className='h-full ' pt={{container:{className:'h-[70vh] bg-white w-full fixed top-0' }, controls:{className:'hidden'}}} />
        <div className='flex justify-center my-4 space-x-2 fixed bottom-1 left-1' >
          <InputText className='text-black text-3xl w-9/12 h-auto ml-0 mr-auto' value={itemInputValue} onChange={e => {
            console.log(`e:`, e);
            setItemInputValue(e.target.value);
          }} />
          <Button severity='secondary' className='text-3xl w-3/12' raised label={'Add'} onClick={async () => {
            console.log(`addItemResult:`, await fetch(new URL(`/api/item`, baseUrl), { method: 'POST', body: JSON.stringify({ name: itemInputValue }), headers:{action:'add'}, mode:'no-cors' }));
            setItemInputValue('');
            getItems();
          }} />
        </div>
      </div>
    </>
  );
}

export default List