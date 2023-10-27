import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { isNumber } from '../../../utility/TextUtility';
import Unique from '../../models/Unique';

export default interface FoodItem extends Unique {
    name: string;
    servings: number;
    calories: number;
    macros: Macros;
}

export interface Macros {
    carbs: number;
    fat: number;
    protein: number;
}

export function createMacros(protein: string, carbs: string, fat: string): Macros {
    return {
        protein: protein === '' ? 0 : isNumber(protein) ? parseInt(protein, 10) : 0,
        carbs: carbs === '' ? 0 : isNumber(carbs) ? parseInt(carbs, 10) : 0,
        fat: fat === '' ? 0 : isNumber(fat) ? parseInt(fat, 10) : 0,
    };
}

export function formatMacros(macros: Macros): string {
    return `protein ${Math.round(macros.protein)}(g), carbs ${Math.round(macros.carbs)}(g), fat ${Math.round(macros.fat)}(g)`;
}

export function createFood(name: string, servings: number, calories: string, macros: Macros): FoodItem {
    return {
        name,
        servings,
        calories: calories === '' ? 0 : isNumber(calories) ? parseInt(calories, 10) : 0,
        macros,
        id: uuidv4(),
    };
}