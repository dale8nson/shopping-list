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

const List = ({ value }: { value: WithId<Document>[] }) => {

  const [items, setItems] = useState([]);
  // const itemsRef = useRef(null);
  const [itemInputValue, setItemInputValue] = useState('');
  const [addItemResult, setAddItemResult] = useState<InsertOneResult<Document> | null>(null);
  const [itemsNeedUpdate, setItemsNeedUpdate] = useState(true);

  const getItems = async () => {
    const items = await fetch('http://localhost:3000/api/items').then(res => res.json());
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
            await fetch(new NextRequest(`http://localhost:3000/api/item`, {method:'POST', body:JSON.stringify({name}),headers:{ action:'delete'}}));
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
        <ListItem {...{ name: item.name, completed: item.completed, value }} />
    )
  }

  console.log(`itemInputValue:`, itemInputValue);
  
  useEffect(() => {

    getItems();

  }, []);
  return (
    <>
      <div className='flex-col my-4' >
        <OrderList {...{ value: items, itemTemplate, header: 'Shopping List', onChange: e => setItems(e.value) }} dragdrop />
        <div className='flex justify-center my-4 space-x-4' >
          <InputText className='text-black text-3xl w-[77.75%] h-auto ml-auto mr-0' value={itemInputValue} onChange={e => {
            console.log(`e:`, e);
            setItemInputValue(e.target.value);
          }} />
          <Button severity='secondary' className='text-3xl' raised label={'Add'} onClick={async () => {
            console.log(`addItemResult:`, await fetch(new NextRequest('http://localhost:3000/api/item', { method: 'POST', body: JSON.stringify({ name: itemInputValue }), headers:{action:'add'} })));
            setItemInputValue('');
            getItems();
          }} />
        </div>
      </div>
    </>
  );
}

export default List