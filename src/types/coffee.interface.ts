import { Timeout } from 'bettertimers';
import { ECoffeeItemName } from './coffee.enums';

export interface IBarista {
	name: string;
	capacity: number;
	orders: Array<IMenuItem>;
	busy: boolean;
	_timeout?: Timeout;
}

export interface IMenuItem {
	name: ECoffeeItemName;
	time: number;
	orderNo: number;
}

export interface ICounterItem extends IMenuItem  {
	name: ECoffeeItemName;
	time: number;
	orderNo: number;
	timeout?: any;
}

