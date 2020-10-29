import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { MenuItems } from './types/coffee.constants';
import { IBarista, IMenuItem, ICounterItem } from './types/coffee.interface';
import { delay } from './utils';

const counterTimeouts: any = [];

function App() {
	const [baristas, setBaristas] = useState<Array<IBarista>>([]);
	const [counter, setCounter] = useState<Array<ICounterItem>>([]);
	const counterRef = useRef(counter);
	counterRef.current = counter;

	useEffect(() => {
		clockIn({ name: 'ahad', capacity: 1 });
	}, []);

  // Recurse the Barista, since this is a functional component and we can't wait on the setState we have to use a use effect for recursion
	useEffect(() => {
		console.log('useEffect baristas: ', baristas);
		baristas.map((barista, idx) => {
			if (barista.orders.length) {
				recurseBarista(idx);
			}
		});
	}, [baristas]);

  // Start the counter timeouts, since this is a functional component and we can't wait on the setState we have to use a use effect for recursion
	useEffect(() => {
		const tempCounter = [...counterRef.current];
		const lastCounterItemIdx = counterRef.current.length - 1;
		if (lastCounterItemIdx >= 0 && !counterTimeouts.includes(lastCounterItemIdx)) {
			setTimeout(() => {
				const newTempCounter = [...counterRef.current];
				newTempCounter.splice(lastCounterItemIdx, 1);

				const removeIdx = counterTimeouts.indexOf(lastCounterItemIdx);
				if (removeIdx > -1) {
					counterTimeouts.splice(removeIdx, 1);
				}

				setCounter(newTempCounter);
			}, 3000);

			counterTimeouts.push(lastCounterItemIdx);
			setCounter(tempCounter);
		}
	}, [counter]);

	useEffect(() => {}, [baristas]);

	// Clocks in a new Barista who can be queued for orders. Capacity is how many orders they can take care of at once
	const clockIn = (person: { name: string; capacity: number }) => {
		const tempBaristas = [...baristas];
		tempBaristas.push({ ...person, orders: [], busy: false, _timeout: undefined });
		setBaristas(tempBaristas);
	};

  // Start a new order for first available Barista
	const newOrder = (order: IMenuItem) => {
		const tempBaristas = [...baristas];

		if (!baristas.length) {
			console.log('No baristas available');
			return;
		}

		// Find the first available Barista, otherwise give it to the lead barista ;)
		let baristaIdx = tempBaristas.findIndex((barista) => barista.orders.length < barista.capacity);
		baristaIdx = baristaIdx >= 0 ? baristaIdx : 0;

		tempBaristas[baristaIdx].orders.push(order);
		setBaristas(tempBaristas);
	};

  // Recurse the Barista, since this is a functional component and we can't wait on the setState we have to use a use effect for recursion
	const recurseBarista = async (baristaIdx: number) => {
		const tempBaristas = [...baristas];
		const barista = tempBaristas[baristaIdx];

		if (!barista.busy) {
			await delay(barista.orders[0].time);
			if (barista.orders[0]) {
				const tempCounter = [...counterRef.current];
				tempCounter.push(barista.orders[0]);
				setCounter(tempCounter);
			}

			barista.orders.shift();
			if (!barista.orders.length) {
				barista.busy = false;
			}

			setBaristas(tempBaristas);
		}
	};

  // Create a random order
	const randomOrder = () => {
		const randItem = Math.floor(Math.random() * 3);
		const orderNo = Math.floor(Math.random() * 100000);
		newOrder({ ...MenuItems[randItem], orderNo });
	};

	return (
		<div className='App'>
			<h1>Welcome To The Steady Coffee Shop</h1>

			<button className='order-button' onClick={randomOrder}>Order Item</button>
			<div className='barista-contain'>
				<h3>Baristas</h3>
				{baristas.map((barista) => (
					<div className={`barista ${barista.orders.length ? 'barista-cooking' : 'barista-empty'}`} key={barista.name}>
						{barista.name} - {barista.orders.length}
					</div>
				))}
			</div>
			<div className='counter-contain'>
				<h3>Counter</h3>
				<div className='counter-table'>
					{counter.map((item, idx) => (
						<div className='counter-order' key={idx}>
							{item.name} - {item.orderNo}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
