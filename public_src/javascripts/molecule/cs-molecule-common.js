export const model_name = 'molecule';
export const column_names = [
    'id',
    'name',
    'form',
    'info',
    'max_solubility',
    'molarity_mm',
    'molarity_unit',
    'pathway',
    'smiles',
    'targets',
    'weight',
    'cell',
    'x',
    'y',
    'platemap',
    'product_info',
    'updated_at',
    'created_at',
];

export const column_name_index_map = column_names.reduce((acc, name, index) => {
    acc[name] = index;
    return acc;
}, {});

export const column_name_show_set = new Set(['name',
    'molarity_mm',
    'pathway',
    'target',
    'cell',
    // 'x',
    // 'y',
    'created_at',
    'info', 'platemap']);

export const column_hide_index_list = column_names.reduce((acc, column_name, index) => {
    if (!column_name_show_set.has(column_name)) {
        acc.push(index);
    }
    return acc;
}, []);
