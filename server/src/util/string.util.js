export const snakeToCamel = s => s.replace(/(_\w)/g, k => k[1].toUpperCase());

export const trimString = (str) => !str || str.trim() === '' ? '' : str.trim();